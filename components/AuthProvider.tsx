// components/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setProtocols = useAppStore((s) => s.setProtocols)

  useEffect(() => {
    const supabase = createClient()

    const loadUserData = async (userId: string, email: string, fallbackCreatedAt: string) => {
      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      setUser(profile ? {
        id: profile.id,
        email: profile.email,
        credits: profile.credits || 0,
        plan: (profile.plan || 'free') as PlanTier,
        favorites: profile.favorites || [],
        created_at: profile.created_at,
      } : {
        id: userId,
        email: email,
        credits: 0,
        plan: 'free' as PlanTier,
        favorites: [],
        created_at: fallbackCreatedAt,
      })

      // Load real protocols from database
      const { data: protocols } = await supabase
        .from('protocols')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (protocols && protocols.length > 0) {
        setProtocols(protocols.map((p: any) => ({
          id: p.id,
          goal: p.goal,
          created_at: p.created_at,
          protocol: p.protocol,
          credits_used: p.credits_used,
          status: p.status || 'active',
          currentWeek: p.current_week || 1,
        })))
      } else {
        setProtocols([])
      }
    }

    // Init: check session
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setUser(null); setProtocols([]); return }
        await loadUserData(user.id, user.email || '', new Date().toISOString())
      } catch (e) {
        console.error('[Auth] init error', e)
        setUser(null)
        setProtocols([])
      }
    }

    init()

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProtocols([])
        return
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        if (event === 'SIGNED_IN') await new Promise(r => setTimeout(r, 500))
        try {
          await loadUserData(session.user.id, session.user.email || '', new Date().toISOString())
        } catch (e) {
          console.error('[Auth] load error', e)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProtocols])

  return <>{children}</>
}
