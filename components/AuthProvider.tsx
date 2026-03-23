// components/AuthProvider.tsx
'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)

  const loadProfile = useCallback(async (authUser: User) => {
    try {
      const supabase = createClient()
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('[Auth] Profile fetch error:', error.message)
        // Profile might not exist yet (new signup, trigger delay)
        // Set user from auth data with defaults
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          credits: 0,
          plan: 'free' as PlanTier,
          favorites: [],
          created_at: authUser.created_at || new Date().toISOString(),
        })
        return
      }

      console.log('[Auth] Profile loaded:', profile.email, 'plan:', profile.plan)

      setUser({
        id: profile.id,
        email: profile.email,
        credits: profile.credits || 0,
        plan: (profile.plan || 'free') as PlanTier,
        favorites: profile.favorites || [],
        created_at: profile.created_at,
      })
    } catch (err) {
      console.error('[Auth] Unexpected error:', err)
    }
  }, [setUser])

  useEffect(() => {
    const supabase = createClient()

    // 1. Check current session on mount
    const initAuth = async () => {
      try {
        // getUser() validates the JWT with Supabase server
        // This is more reliable than getSession() which only reads local storage
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.log('[Auth] No active session:', error.message)
          setUser(null)
          return
        }

        if (user) {
          console.log('[Auth] Session found for:', user.email)
          await loadProfile(user)
        } else {
          console.log('[Auth] No user in session')
          setUser(null)
        }
      } catch (err) {
        console.error('[Auth] Init error:', err)
        setUser(null)
      }
    }

    initAuth()

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State change:', event)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Small delay for SIGNED_IN to let DB trigger create profile
            if (event === 'SIGNED_IN') {
              await new Promise(r => setTimeout(r, 800))
            }
            await loadProfile(session.user)
          }
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, loadProfile])

  return <>{children}</>
}
