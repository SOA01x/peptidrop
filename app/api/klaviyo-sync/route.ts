// app/api/klaviyo-sync/route.ts
// API route fallback: syncs new signups to Klaviyo
// Called from the signup page after successful registration

import { NextResponse, type NextRequest } from 'next/server'

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID

export async function POST(request: NextRequest) {
  if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
    return NextResponse.json({ error: 'Klaviyo not configured' }, { status: 500 })
  }

  try {
    const { email, full_name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Build profile attributes
    const profileAttributes: Record<string, string> = { email }
    if (full_name) {
      const parts = full_name.trim().split(/\s+/)
      profileAttributes.first_name = parts[0]
      if (parts.length > 1) {
        profileAttributes.last_name = parts.slice(1).join(' ')
      }
    }

    const res = await fetch(
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

    if (!res.ok) {
      const errorBody = await res.text()
      console.error('Klaviyo error:', res.status, errorBody)
      return NextResponse.json({ error: 'Klaviyo API error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Klaviyo sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
