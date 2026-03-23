// app/profile/page.tsx
'use client'

import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, credits, protocols, favorites, plan, setUser } = useAppStore()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null) // Clear store immediately
    router.push('/')
    router.refresh()
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
          {/* Account Info */}
          <div className="glass-panel p-6 sm:p-8">
            <h3 className="font-display font-semibold text-lg mb-4">Account</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Email</span>
                <span className="text-sm font-mono">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Plan</span>
                <span className="text-sm font-mono text-accent-cyan capitalize">{plan}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Credits</span>
                <span className="text-sm font-mono text-accent-cyan">{credits}</span>
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

          {/* Upgrade */}
          {plan === 'free' && (
            <div className="glass-panel glow-border p-6 sm:p-8 text-center">
              <h3 className="font-display font-bold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-text-muted text-sm mb-4">Unlock AI protocols, tracking, and advanced analysis</p>
              <Link href="/pricing" className="btn-primary text-sm">View Plans — $29/mo</Link>
            </div>
          )}

          {/* Sign Out */}
          <div className="glass-panel p-6 sm:p-8 border-accent-rose/20">
            <h3 className="font-display font-semibold text-lg mb-4 text-accent-rose">Account Actions</h3>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 border border-accent-rose/30 text-accent-rose rounded-xl text-sm font-medium hover:bg-accent-rose/10 transition-colors min-h-[44px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
