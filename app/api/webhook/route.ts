// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Coinbase Commerce Webhook Handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-cc-webhook-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET!
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    switch (event.type) {
      case 'charge:confirmed': {
        // Payment confirmed — add credits
        const metadata = event.data?.metadata
        const userId = metadata?.user_id
        const creditPackage = metadata?.package_id

        if (!userId || !creditPackage) {
          console.error('Missing metadata in webhook:', metadata)
          break
        }

        // TODO: Use Supabase service role client to add credits
        // const supabase = createServiceRoleClient()
        // const { data: profile } = await supabase
        //   .from('profiles')
        //   .select('credits')
        //   .eq('id', userId)
        //   .single()
        //
        // const creditsToAdd = CREDIT_PACKAGES.find(p => p.id === creditPackage)?.credits || 0
        // await supabase
        //   .from('profiles')
        //   .update({ credits: (profile?.credits || 0) + creditsToAdd })
        //   .eq('id', userId)
        //
        // // Log transaction
        // await supabase.from('transactions').insert({
        //   user_id: userId,
        //   package_id: creditPackage,
        //   credits_added: creditsToAdd,
        //   charge_id: event.data.id,
        //   status: 'confirmed',
        // })

        console.log(`Credits added for user ${userId}: package ${creditPackage}`)
        break
      }

      case 'charge:failed': {
        console.log('Charge failed:', event.data?.id)
        break
      }

      case 'charge:pending': {
        console.log('Charge pending:', event.data?.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
