// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { buildProtocolPrompt, type ProtocolInput } from '@/lib/ai-engine'

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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {},
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

    // Try cookie-based auth first, then fall back to Authorization header
    let user = null
    const supabase = createSupabaseFromRequest(req)

    const { data: userData } = await supabase.auth.getUser()
    if (userData?.user) {
      user = userData.user
      console.log('[Generate] Cookie auth OK:', user.email)
    }

    // Fallback: read Bearer token from Authorization header (client-side localStorage session)
    if (!user) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)
        const supabaseWithToken = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        )
        const { data: tokenUser } = await supabaseWithToken.auth.getUser()
        if (tokenUser?.user) {
          user = tokenUser.user
          console.log('[Generate] Token auth OK:', user.email)
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated. Please sign out and sign back in.' }, { status: 401 })
    }

    // Use service role client for DB operations (bypasses RLS, user already verified above)
    const dbClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check plan
    const { data: profile } = await dbClient
      .from('profiles').select('plan').eq('id', user.id).single()

    if (!profile || profile.plan !== 'pro') {
      return NextResponse.json({ error: 'Pro subscription required.' }, { status: 402 })
    }

    // Call Claude
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    console.log('[Generate] Calling Claude for:', user.email, 'Goal:', body.goal)

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
        messages: [{ role: 'user', content: buildProtocolPrompt(body) }],
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      console.error('[Generate] Claude error:', claudeRes.status, errText.substring(0, 300))
      if (claudeRes.status === 401) return NextResponse.json({ error: 'AI API key invalid.' }, { status: 500 })
      if (claudeRes.status === 429) return NextResponse.json({ error: 'AI busy. Try again in a minute.' }, { status: 429 })
      return NextResponse.json({ error: 'AI generation failed. Try again.' }, { status: 500 })
    }

    const claudeData = await claudeRes.json()
    const textContent = claudeData.content?.find((c: any) => c.type === 'text')?.text

    if (!textContent) {
      return NextResponse.json({ error: 'No AI response.' }, { status: 500 })
    }

    let protocol: any
    try {
      protocol = JSON.parse(textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    } catch {
      console.error('[Generate] Parse error:', textContent.substring(0, 300))
      return NextResponse.json({ error: 'AI returned invalid format. Try again.' }, { status: 500 })
    }

    const { data: saved, error: saveErr } = await dbClient
      .from('protocols')
      .insert({
        user_id: user.id, goal: body.goal, gender: body.gender || null,
        input: body, protocol, status: 'active', current_week: 1, credits_used: 0,
      })
      .select().single()

    if (saveErr) {
      console.error('[Generate] Save error:', saveErr.message)
      return NextResponse.json({ protocol, saved: false })
    }

    return NextResponse.json({ protocol, protocolId: saved.id, saved: true })
  } catch (error: any) {
    console.error('[Generate] Error:', error.message)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
