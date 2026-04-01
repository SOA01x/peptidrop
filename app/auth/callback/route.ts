// app/auth/callback/route.ts
// Handles the redirect from Supabase email confirmation links
// When user clicks the confirmation link, Supabase redirects here with a ?code= param
// We exchange that code for a session, then redirect to dashboard

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Called from Server Component - ignore
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful verification - redirect to dashboard or confirm page
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin
      return NextResponse.redirect(`${appUrl}/auth/confirm`)
    }
  }

  // If code exchange failed, redirect to error page
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  return NextResponse.redirect(`${appUrl}/auth/confirm?error=Could+not+verify+email`)
}
