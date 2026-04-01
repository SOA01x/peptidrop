// app/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { createClient } from '@/lib/supabase'
import { loadUserProfile } from '@/components/AuthProvider'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: fullName },
        },
      })
      if (authError) throw authError

      // Sync to Klaviyo (fire-and-forget, don't block signup)
      fetch('/api/klaviyo-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName }),
      }).catch(() => {}) // silently ignore if Klaviyo sync fails

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation is ON - show success message
        setSuccess(true)
        return
      }

      // Email confirmation is OFF - user is logged in immediately
      if (data.user && data.session) {
        // Wait a moment for the DB trigger to create the profile
        await new Promise(r => setTimeout(r, 1000))

        await loadUserProfile(supabase, data.user.id, data.user.email || '', data.user.created_at || new Date().toISOString())

        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navigation />
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="glass-panel p-8 sm:p-10 text-center">
            <span className="text-4xl block mb-4">📧</span>
            <h1 className="font-display font-bold text-2xl mb-3">Check Your Email</h1>
            <p className="text-text-secondary text-sm mb-6">
              We sent a confirmation link to <span className="text-accent-cyan">{email}</span>. Click the link to activate your account.
            </p>
            <Link href="/login" className="text-accent-cyan text-sm hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Navigation />

      <div className="w-full max-w-md px-4 sm:px-6">
        <div className="glass-panel p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl mb-2">Get Started</h1>
            <p className="text-text-muted text-sm">Create your free Peptidrop account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Full Name</label>
              <input
                type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                required placeholder="John Doe" className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com" className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="Min 8 characters" className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Confirm Password</label>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                required placeholder="Confirm your password" className="input-field"
              />
            </div>

            {error && <p className="text-accent-rose text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-cyan hover:underline">Sign in</Link>
          </p>

          <p className="text-center text-xs text-text-muted mt-4">
            By signing up, you agree to our <Link href="/terms" className="text-accent-cyan hover:underline">Terms of Service</Link> and
            acknowledge that all information is for educational purposes only.
          </p>
        </div>
      </div>
    </main>
  )
}
