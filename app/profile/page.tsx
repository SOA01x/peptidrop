// app/profile/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const user = useAppStore((s) => s.user)
  const plan = useAppStore((s) => s.plan)
  const protocols = useAppStore((s) => s.protocols)
  const favorites = useAppStore((s) => s.favorites)
  const setUser = useAppStore((s) => s.setUser)
  const setProtocols = useAppStore((s) => s.setProtocols)
  const setSavedStacks = useAppStore((s) => s.setSavedStacks)
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // Clear all store data
      setUser(null)
      setProtocols([])
      setSavedStacks([])
      // Navigate
      router.push('/')
      router.refresh()
    } catch (e) {
      console.error('Logout error:', e)
    }
    setLoggingOut(false)
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-4xl block mb-4">🔒</span>
          <h1 className="font-display font-bold text-2xl mb-3">Not Signed In</h1>
          <p className="text-text-muted text-sm mb-6">Sign in to view your profile.</p>
          <Link href="/login" className="btn-primary text-sm">Sign In</Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-8">Profile</h1>

        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8">
            <h3 className="font-display font-semibold text-lg mb-4">Account</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Email</span>
                <span className="text-sm font-mono">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Plan</span>
                <span className="text-sm font-display font-semibold text-accent-cyan capitalize">{plan}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Protocols Generated</span>
                <span className="text-sm font-mono">{protocols.length}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-text-muted text-sm">Favorite Peptides</span>
                <span className="text-sm font-mono">{favorites.length}</span>
              </div>
            </div>
          </div>

          {plan === 'free' && (
            <div className="glass-panel glow-border p-6 sm:p-8 text-center">
              <h3 className="font-display font-bold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-text-muted text-sm mb-4">Unlimited AI protocols, tracking, and analysis</p>
              <Link href="/pricing" className="btn-primary text-sm">Upgrade — $29/mo</Link>
            </div>
          )}

          <div className="glass-panel p-6 sm:p-8">
            <h3 className="font-display font-semibold text-lg mb-4 text-accent-rose">Account Actions</h3>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-6 py-3 border border-accent-rose/30 text-accent-rose rounded-xl text-sm font-medium hover:bg-accent-rose/10 transition-colors min-h-[44px] disabled:opacity-50"
            >
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
