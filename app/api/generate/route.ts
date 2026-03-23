// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { buildProtocolPrompt, type ProtocolInput } from '@/lib/ai-engine'

// Increase timeout for Vercel Pro plan (default 10s on Hobby)
export const maxDuration = 60

function createSupabaseFromRequest(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          // Can't set cookies in POST response easily, but auth works from getAll
        },
      },
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body: ProtocolInput = await req.json()

    if (!body.goal || !body.experienceLevel || !body.age) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Auth
    const supabase = createSupabaseFromRequest(req)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Generate] Auth error:', authError?.message)
      return NextResponse.json({ error: 'Not authenticated. Please sign in again.' }, { status: 401 })
    }

    // Credits check
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('[Generate] Profile error:', profileError?.message)
      return NextResponse.json({ error: 'Profile not found. Please sign in again.' }, { status: 404 })
    }

    if (profile.plan !== 'pro' && profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits. Upgrade to Pro.' }, { status: 402 })
    }

    // Build prompt
    const prompt = buildProtocolPrompt(body)

    // Call Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('[Generate] ANTHROPIC_API_KEY not set')
      return NextResponse.json({ error: 'AI service not configured. Contact support.' }, { status: 500 })
    }

    console.log('[Generate] Calling Claude API for user:', user.email, 'goal:', body.goal)

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      console.error('[Generate] Claude API error:', claudeRes.status, errText)

      if (claudeRes.status === 401) {
        return NextResponse.json({ error: 'AI API key is invalid. Contact support.' }, { status: 500 })
      }
      if (claudeRes.status === 429) {
        return NextResponse.json({ error: 'AI service is busy. Please try again in a minute.' }, { status: 429 })
      }
      if (claudeRes.status === 400) {
        return NextResponse.json({ error: 'AI request error. Please try different parameters.' }, { status: 500 })
      }

      return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
    }

    const claudeData = await claudeRes.json()
    const textContent = claudeData.content?.find((c: any) => c.type === 'text')?.text

    if (!textContent) {
      console.error('[Generate] No text in Claude response:', JSON.stringify(claudeData).substring(0, 200))
      return NextResponse.json({ error: 'No response from AI. Please try again.' }, { status: 500 })
    }

    // Parse JSON
    let protocol: any
    try {
      const cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      protocol = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('[Generate] JSON parse error. Raw (first 500 chars):', textContent.substring(0, 500))
      return NextResponse.json({ error: 'AI returned invalid format. Please try again.' }, { status: 500 })
    }

    console.log('[Generate] Protocol parsed successfully. Saving...')

    // Deduct credit
    await supabase
      .from('profiles')
      .update({ credits: Math.max(0, profile.credits - 1) })
      .eq('id', user.id)

    // Save protocol
    const { data: savedProtocol, error: saveError } = await supabase
      .from('protocols')
      .insert({
        user_id: user.id,
        goal: body.goal,
        gender: body.gender || null,
        input: body,
        protocol: protocol,
        status: 'active',
        current_week: 1,
        credits_used: 1,
      })
      .select()
      .single()

    if (saveError) {
      console.error('[Generate] Save error:', saveError.message)
      // Return protocol even if save fails
      return NextResponse.json({ protocol, creditsUsed: 1, saved: false })
    }

    console.log('[Generate] Saved protocol:', savedProtocol.id)

    return NextResponse.json({
      protocol,
      protocolId: savedProtocol.id,
      creditsUsed: 1,
      saved: true,
      creditsRemaining: Math.max(0, profile.credits - 1),
    })
  } catch (error: any) {
    console.error('[Generate] Unexpected error:', error.message || error)
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
