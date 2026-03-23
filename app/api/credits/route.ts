// app/api/credits/route.ts
// NOWPayments Invoice Creation
import { NextRequest, NextResponse } from 'next/server'
import { PRICING_PLANS, REPORT_TYPES } from '@/lib/utils'

const NOWPAYMENTS_API = 'https://api.nowpayments.io/v1'

export async function POST(req: NextRequest) {
  try {
    const { type, planId, reportType, userId } = await req.json()

    // Determine amount based on purchase type
    let priceAmount: number
    let description: string
    let orderId: string

    if (type === 'subscription') {
      const plan = PRICING_PLANS.find(p => p.id === planId)
      if (!plan || plan.price === 0) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }
      priceAmount = plan.price
      description = `Peptidrop ${plan.label} Plan - Monthly Subscription`
      orderId = `sub_${userId}_${planId}_${Date.now()}`

    } else if (type === 'report') {
      const report = REPORT_TYPES.find(r => r.id === reportType)
      if (!report) {
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
      }
      priceAmount = report.price
      description = `Peptidrop Clinical Report: ${report.label}`
      orderId = `rpt_${userId}_${reportType}_${Date.now()}`

    } else {
      return NextResponse.json({ error: 'Invalid purchase type' }, { status: 400 })
    }

    // Create NOWPayments invoice
    // Invoice method = user gets redirected to NOWPayments hosted page
    // where they pick their crypto and pay. Simplest integration.
    const response = await fetch(`${NOWPAYMENTS_API}/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOWPAYMENTS_API_KEY!,
      },
      body: JSON.stringify({
        price_amount: priceAmount,
        price_currency: 'usd',
        order_id: orderId,
        order_description: description,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
        // If you want to restrict to specific cryptos:
        // pay_currency: 'usdttrc20',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('NOWPayments error:', err)
      return NextResponse.json(
        { error: 'Payment creation failed' },
        { status: 500 }
      )
    }

    const invoice = await response.json()

    // invoice.invoice_url = hosted payment page user visits
    // invoice.id = invoice ID for tracking

    return NextResponse.json({
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
      orderId,
    })
  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
