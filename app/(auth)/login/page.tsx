// app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'
import { cn } from '@/lib/utils'

const SAVED_EMAIL_KEY = 'peptidrop_saved_email'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberEmail, setRememberEmail] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAppStore()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_EMAIL_KEY)
      if (saved) {
        setEmail(saved)
        setRememberEmail(true)
      }
    } catch {}
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (rememberEmail) {
        localStorage.setItem(SAVED_EMAIL_KEY, email)
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY)
      }
    } catch {}

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        setUser(profile ? {
          id: profile.id, email: profile.email,
          credits: profile.credits || 0,
          plan: (profile.plan || 'free') as PlanTier,
          favorites: profile.favorites || [],
          created_at: profile.created_at,
        } : {
          id: data.user.id, email: data.user.email || '',
          credits: 0, plan: 'free', favorites: [],
          created_at: new Date().toISOString(),
        })
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Navigation />
      <div className="w-full max-w-md px-4 sm:px-6">
        <div className="glass-panel p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl mb-2">Welcome Back</h1>
            <p className="text-text-muted text-sm">Sign in to your Peptidrop account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com" className="input-field" autoComplete="email" />
            </div>
            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••" className="input-field" autoComplete="current-password" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
                rememberEmail ? 'bg-accent-cyan/20 border-accent-cyan' : 'border-surface-border group-hover:border-text-muted'
              )}>
                {rememberEmail && (
                  <svg className="w-3 h-3 text-accent-cyan" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} className="sr-only" />
              <span className="text-sm text-text-muted group-hover:text-text-secondary transition-colors">Remember my email</span>
            </label>

            {error && <p className="text-accent-rose text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent-cyan hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
