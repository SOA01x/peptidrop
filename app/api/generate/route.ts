// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { buildProtocolPrompt, type ProtocolInput } from '@/lib/ai-engine'

function createSupabaseFromRequest(req: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  return { supabase, response }
}

export async function POST(req: NextRequest) {
  try {
    const body: ProtocolInput = await req.json()

    if (!body.goal || !body.experienceLevel || !body.age) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get authenticated user
    const { supabase } = createSupabaseFromRequest(req)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated. Please sign in.' }, { status: 401 })
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (profile.plan !== 'pro' && profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits. Upgrade to Pro or purchase credits.' }, { status: 402 })
    }

    // Build prompt and call Claude
    const prompt = buildProtocolPrompt(body)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Claude API error:', err)
      return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
    }

    const data = await response.json()
    const textContent = data.content.find((c: any) => c.type === 'text')?.text

    if (!textContent) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse JSON
    let protocol: any
    try {
      const cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      protocol = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr)
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 })
    }

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
      console.error('Save protocol error:', saveError)
      return NextResponse.json({ protocol, creditsUsed: 1, saved: false })
    }

    return NextResponse.json({
      protocol,
      protocolId: savedProtocol.id,
      creditsUsed: 1,
      saved: true,
      creditsRemaining: Math.max(0, profile.credits - 1),
    })
  } catch (error: any) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
