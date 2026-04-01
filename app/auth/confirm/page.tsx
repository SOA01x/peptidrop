// app/auth/confirm/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import { createClient } from '@/lib/supabase'
import { loadUserProfile } from '@/components/AuthProvider'

function ConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    errorParam ? 'error' : 'loading'
  )
  const [errorMsg, setErrorMsg] = useState(errorParam || '')

  useEffect(() => {
    if (errorParam) {
      setStatus('error')
      setErrorMsg(errorParam)
      return
    }

    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          setStatus('error')
          setErrorMsg('Session not found. Please try logging in.')
          return
        }

        // Load user profile into store
        await loadUserProfile(
          supabase,
          user.id,
          user.email || '',
          user.created_at || new Date().toISOString()
        )

        setStatus('success')

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => router.push('/dashboard'), 3000)
      } catch {
        setStatus('error')
        setErrorMsg('Something went wrong. Please try logging in.')
      }
    }

    checkSession()
  }, [errorParam, router])

  return (
    <div className="glass-panel p-8 sm:p-10 text-center">
      {status === 'loading' && (
        <>
          <div className="w-12 h-12 border-3 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl mb-3">Verifying Your Email</h1>
          <p className="text-text-secondary text-sm">Please wait...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <span className="text-4xl block mb-4">&#10003;</span>
          <h1 className="font-display font-bold text-2xl mb-3 text-accent-cyan">
            Email Verified!
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            Your account is confirmed. Redirecting to dashboard...
          </p>
          <Link href="/dashboard" className="btn-primary inline-block px-6 py-2.5 text-sm">
            Go to Dashboard
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <span className="text-4xl block mb-4">&#10007;</span>
          <h1 className="font-display font-bold text-2xl mb-3 text-accent-rose">
            Verification Failed
          </h1>
          <p className="text-text-secondary text-sm mb-6">{errorMsg}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="btn-primary inline-block px-6 py-2.5 text-sm">
              Sign In
            </Link>
            <Link href="/signup" className="glass-panel inline-block px-6 py-2.5 text-sm hover:bg-white/5 transition">
              Try Again
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Navigation />
      <div className="w-full max-w-md px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="glass-panel p-8 sm:p-10 text-center">
              <div className="w-12 h-12 border-3 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h1 className="font-display font-bold text-2xl mb-3">Verifying Your Email</h1>
              <p className="text-text-secondary text-sm">Please wait...</p>
            </div>
          }
        >
          <ConfirmContent />
        </Suspense>
      </div>
    </main>
  )
}
