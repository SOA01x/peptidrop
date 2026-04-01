// supabase/functions/sync-to-klaviyo/index.ts
// Supabase Edge Function: syncs new auth.users to Klaviyo list
// Triggered by Database Webhook on auth.users INSERT

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_API_KEY')!
const KLAVIYO_LIST_ID = Deno.env.get('KLAVIYO_LIST_ID')!
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET') // optional, for verifying webhook

interface WebhookPayload {
  type: 'INSERT'
  table: string
  schema: string
  record: {
    id: string
    email: string
    raw_user_meta_data: {
      full_name?: string
    }
    created_at: string
  }
  old_record: null
}

serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload: WebhookPayload = await req.json()

    // Validate it's an INSERT on auth.users
    if (payload.type !== 'INSERT' || !payload.record?.email) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const email = payload.record.email
    const fullName = payload.record.raw_user_meta_data?.full_name || ''

    // Build profile attributes
    const profileAttributes: Record<string, string> = { email }
    if (fullName) {
      // Klaviyo uses first_name / last_name
      const parts = fullName.trim().split(/\s+/)
      profileAttributes.first_name = parts[0]
      if (parts.length > 1) {
        profileAttributes.last_name = parts.slice(1).join(' ')
      }
    }

    // Use the Subscribe API - creates profile + subscribes to list in one call
    const subscribeResponse = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'Content-Type': 'application/json',
          revision: '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: profileAttributes,
                  },
                ],
              },
              historical_import: false,
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: KLAVIYO_LIST_ID,
                },
              },
            },
          },
        }),
      }
    )

    if (!subscribeResponse.ok) {
      const errorBody = await subscribeResponse.text()
      console.error('Klaviyo API error:', subscribeResponse.status, errorBody)
      return new Response(
        JSON.stringify({
          error: 'Klaviyo API error',
          status: subscribeResponse.status,
          detail: errorBody,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Synced ${email} to Klaviyo list ${KLAVIYO_LIST_ID}`)

    return new Response(
      JSON.stringify({ success: true, email }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
