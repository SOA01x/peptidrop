// app/profile/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, credits, protocols, favorites } = useAppStore()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <h1 className="font-display font-bold text-4xl mb-8">Profile</h1>

        <div className="space-y-6">
          {/* Account Info */}
          <div className="glass-panel p-8">
            <h3 className="font-display font-semibold text-lg mb-4">Account</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface-border/30">
                <span className="text-text-muted text-sm">Email</span>
                <span className="text-sm font-mono">{user?.email || 'Not signed in'}</span>
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

          {/* Danger Zone */}
          <div className="glass-panel p-8 border-accent-rose/20">
            <h3 className="font-display font-semibold text-lg mb-4 text-accent-rose">Account Actions</h3>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 border border-accent-rose/30 text-accent-rose rounded-xl text-sm font-medium hover:bg-accent-rose/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
