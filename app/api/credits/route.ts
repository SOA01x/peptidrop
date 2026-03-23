// app/api/credits/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { CREDIT_PACKAGES } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { packageId, userId } = await req.json()

    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId)
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    // Create Coinbase Commerce charge
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY!,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify({
        name: `Peptidrop ${pkg.label} Credits`,
        description: `${pkg.credits} protocol generation credits`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: pkg.priceUSDC.toString(),
          currency: 'USD',
        },
        metadata: {
          user_id: userId,
          package_id: packageId,
          credits: pkg.credits,
        },
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Coinbase Commerce error:', err)
      return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
    }

    const charge = await response.json()

    return NextResponse.json({
      chargeId: charge.data.id,
      hostedUrl: charge.data.hosted_url,
      expiresAt: charge.data.expires_at,
    })
  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
