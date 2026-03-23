// app/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { credits: 3 }, // Free starter credits
        },
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Navigation />

      <div className="w-full max-w-md px-6">
        <div className="glass-panel p-10">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl mb-2">Get Started</h1>
            <p className="text-text-muted text-sm">Create your Peptidrop account — 3 free credits</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min 8 characters"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="input-field"
              />
            </div>

            {error && (
              <p className="text-accent-rose text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-cyan hover:underline">Sign in</Link>
          </p>

          <p className="text-center text-xs text-text-muted mt-4">
            By signing up, you agree to our Terms of Service and acknowledge that all information is for educational purposes only.
          </p>
        </div>
      </div>
    </main>
  )
}
