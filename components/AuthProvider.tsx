// components/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useAppStore()

  useEffect(() => {
    const supabase = createClient()

    // Load session on mount
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              credits: profile.credits || 0,
              plan: (profile.plan || 'free') as PlanTier,
              favorites: profile.favorites || [],
              created_at: profile.created_at,
            })
          } else {
            // Profile doesn't exist yet (maybe trigger hasn't fired)
            // Set user from auth data with defaults
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              credits: 0,
              plan: 'free',
              favorites: [],
              created_at: session.user.created_at || new Date().toISOString(),
            })
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth load error:', err)
        setUser(null)
      }
    }

    loadSession()

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth]', event)

        if (event === 'SIGNED_IN' && session?.user) {
          // Small delay to let the DB trigger create the profile
          await new Promise(r => setTimeout(r, 500))

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              credits: profile.credits || 0,
              plan: (profile.plan || 'free') as PlanTier,
              favorites: profile.favorites || [],
              created_at: profile.created_at,
            })
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              credits: 0,
              plan: 'free',
              favorites: [],
              created_at: session.user.created_at || new Date().toISOString(),
            })
          }
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
        }

        if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Re-fetch profile on token refresh to get latest credits/plan
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              credits: profile.credits || 0,
              plan: (profile.plan || 'free') as PlanTier,
              favorites: profile.favorites || [],
              created_at: profile.created_at,
            })
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser])

  return <>{children}</>
}
