// app/api/webhook/route.ts
// NOWPayments IPN (Instant Payment Notification) Webhook Handler
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()

    // ============================================
    // STEP 1: Verify IPN signature
    // ============================================
    const receivedSig = req.headers.get('x-nowpayments-sig')

    if (!receivedSig) {
      console.error('Webhook: Missing x-nowpayments-sig header')
      return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }

    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET!

    // NOWPayments signature: HMAC-SHA512 of sorted JSON body
    const parsedBody = JSON.parse(body)

    // Sort the keys alphabetically for signature calculation
    const sortedKeys = Object.keys(parsedBody).sort()
    const sortedBody: Record<string, any> = {}
    for (const key of sortedKeys) {
      sortedBody[key] = parsedBody[key]
    }

    const expectedSig = crypto
      .createHmac('sha512', ipnSecret)
      .update(JSON.stringify(sortedBody))
      .digest('hex')

    if (receivedSig !== expectedSig) {
      console.error('Webhook: Invalid signature')
      console.error('  Received:', receivedSig)
      console.error('  Expected:', expectedSig)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // ============================================
    // STEP 2: Process the payment status
    // ============================================
    const {
      payment_id,
      payment_status,
      order_id,
      order_description,
      price_amount,
      price_currency,
      pay_amount,
      pay_currency,
      actually_paid,
      outcome_amount,
    } = parsedBody

    console.log(`[NOWPayments] Payment ${payment_id}: ${payment_status}`)
    console.log(`  Order: ${order_id}`)
    console.log(`  Amount: ${price_amount} ${price_currency}`)
    console.log(`  Paid: ${actually_paid} ${pay_currency}`)

    // Parse the order_id to extract user ID and purchase type
    // Format: sub_userId_planId_timestamp  or  rpt_userId_reportType_timestamp
    const orderParts = (order_id || '').split('_')
    const purchaseType = orderParts[0] // 'sub' or 'rpt'
    const userId = orderParts[1]
    const itemId = orderParts[2]

    switch (payment_status) {
      case 'finished': {
        // ✅ Payment fully confirmed - activate the purchase
        console.log(`✅ Payment confirmed for user ${userId}`)

        if (purchaseType === 'sub') {
          // Subscription payment - upgrade user to Pro
          // TODO: Uncomment when Supabase is configured
          //
          // const supabase = createServiceRoleClient()
          // const expiresAt = new Date()
          // expiresAt.setMonth(expiresAt.getMonth() + 1) // +1 month
          //
          // await supabase
          //   .from('profiles')
          //   .update({
          //     plan: 'pro',
          //     plan_expires_at: expiresAt.toISOString(),
          //   })
          //   .eq('id', userId)
          //
          // await supabase.from('transactions').insert({
          //   user_id: userId,
          //   type: 'subscription',
          //   plan: itemId,
          //   amount_usd: price_amount,
          //   charge_id: String(payment_id),
          //   status: 'confirmed',
          //   metadata: { pay_currency, actually_paid, outcome_amount },
          // })

          console.log(`  → User ${userId} upgraded to Pro (plan: ${itemId})`)

        } else if (purchaseType === 'rpt') {
          // Clinical report purchase - mark as paid
          // TODO: Uncomment when Supabase is configured
          //
          // const supabase = createServiceRoleClient()
          //
          // await supabase.from('clinical_reports').insert({
          //   user_id: userId,
          //   report_type: itemId,
          //   amount_paid: price_amount,
          // })
          //
          // await supabase.from('transactions').insert({
          //   user_id: userId,
          //   type: 'report',
          //   amount_usd: price_amount,
          //   charge_id: String(payment_id),
          //   status: 'confirmed',
          //   metadata: { report_type: itemId, pay_currency, actually_paid },
          // })

          console.log(`  → Clinical report "${itemId}" unlocked for ${userId}`)
        }

        break
      }

      case 'partially_paid': {
        // ⚠️ User sent less than required - log it
        console.log(`⚠️ Partial payment: ${actually_paid}/${pay_amount} ${pay_currency}`)
        // You could notify the user or auto-refund
        break
      }

      case 'confirming': {
        // ⏳ Transaction detected on blockchain, waiting for confirmations
        console.log(`⏳ Confirming payment ${payment_id}...`)
        break
      }

      case 'confirmed': {
        // ✅ Confirmed on blockchain, but NOWPayments still processing
        console.log(`✅ Blockchain confirmed, processing...`)
        break
      }

      case 'sending': {
        // Funds being sent to your wallet
        console.log(`📤 Sending funds to your wallet...`)
        break
      }

      case 'failed': {
        console.log(`❌ Payment failed: ${payment_id}`)
        // TODO: Log failed transaction
        break
      }

      case 'refunded': {
        console.log(`↩️ Payment refunded: ${payment_id}`)
        // TODO: Revert the user's plan/access
        break
      }

      case 'expired': {
        console.log(`⏰ Payment expired: ${payment_id}`)
        break
      }

      default:
        console.log(`Unknown status: ${payment_status}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
