// components/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)

  useEffect(() => {
    const supabase = createClient()

    // Load user on mount
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setUser(null); return }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        setUser(profile ? {
          id: profile.id,
          email: profile.email,
          credits: profile.credits || 0,
          plan: (profile.plan || 'free') as PlanTier,
          favorites: profile.favorites || [],
          created_at: profile.created_at,
        } : {
          id: user.id,
          email: user.email || '',
          credits: 0,
          plan: 'free' as PlanTier,
          favorites: [],
          created_at: new Date().toISOString(),
        })
      } catch (e) {
        console.error('[Auth] init error', e)
        setUser(null)
      }
    }

    init()

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        return
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        // Delay slightly on sign in to let DB trigger fire
        if (event === 'SIGNED_IN') await new Promise(r => setTimeout(r, 500))

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          setUser(profile ? {
            id: profile.id,
            email: profile.email,
            credits: profile.credits || 0,
            plan: (profile.plan || 'free') as PlanTier,
            favorites: profile.favorites || [],
            created_at: profile.created_at,
          } : {
            id: session.user.id,
            email: session.user.email || '',
            credits: 0,
            plan: 'free' as PlanTier,
            favorites: [],
            created_at: new Date().toISOString(),
          })
        } catch (e) {
          console.error('[Auth] profile load error', e)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return <>{children}</>
}
