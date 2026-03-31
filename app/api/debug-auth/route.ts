// app/api/debug-auth/route.ts
// TEMPORARY debug route - remove after fixing auth
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if env vars exist
  const envCheck = {
    hasUrl: !!supabaseUrl,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
    hasKey: !!supabaseKey,
    keyPrefix: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'MISSING',
  }

  // Check cookies
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  const supabaseCookies = allCookies
    .filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
    .map(c => ({ name: c.name, valueLength: c.value.length }))

  // Try to get session server-side
  let sessionInfo = null
  try {
    const supabase = createServerClient(
      supabaseUrl!,
      supabaseKey!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {},
          remove(name: string, options: CookieOptions) {},
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    sessionInfo = {
      hasUser: !!user,
      userId: user?.id || null,
      email: user?.email || null,
      error: error?.message || null,
    }
  } catch (e: any) {
    sessionInfo = { error: e.message }
  }

  return NextResponse.json({
    env: envCheck,
    cookies: supabaseCookies,
    cookieCount: allCookies.length,
    session: sessionInfo,
    requestUrl: req.url,
    host: req.headers.get('host'),
  }, { status: 200 })
}
