// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { buildProtocolPrompt, type ProtocolInput } from '@/lib/ai-engine'

export async function POST(req: NextRequest) {
  try {
    const body: ProtocolInput = await req.json()

    // Validate required fields
    if (!body.goal || !body.experienceLevel || !body.age) {
      return NextResponse.json(
        { error: 'Missing required fields: goal, experienceLevel, age' },
        { status: 400 }
      )
    }

    // TODO: Validate user credits via Supabase
    // const supabase = createServiceRoleClient()
    // const user = await getAuthenticatedUser(req)
    // if (user.credits < 1) return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })

    const prompt = buildProtocolPrompt(body)

    // Call Anthropic Claude API
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
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Claude API error:', err)
      return NextResponse.json(
        { error: 'AI generation failed. Please try again.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const textContent = data.content.find((c: any) => c.type === 'text')?.text

    if (!textContent) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse JSON response
    let protocol
    try {
      // Strip any markdown code fences if present
      const cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      protocol = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr)
      console.error('Raw response:', textContent)
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

    // TODO: Deduct credits
    // await supabase.from('profiles').update({ credits: user.credits - 1 }).eq('id', user.id)

    // TODO: Save protocol to history
    // await supabase.from('protocols').insert({ user_id: user.id, goal: body.goal, protocol, credits_used: 1 })

    return NextResponse.json({ protocol, creditsUsed: 1 })
  } catch (error: any) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
