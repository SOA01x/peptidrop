// components/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'
import type { SavedStack } from '@/lib/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setProtocols = useAppStore((s) => s.setProtocols)
  const setSavedStacks = useAppStore((s) => s.setSavedStacks)

  useEffect(() => {
    const supabase = createClient()

    const loadUserData = async (userId: string, email: string, fallbackCreatedAt: string) => {
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', userId).maybeSingle()

      setUser(profile ? {
        id: profile.id, email: profile.email,
        credits: profile.credits || 0,
        plan: (profile.plan || 'free') as PlanTier,
        favorites: profile.favorites || [],
        created_at: profile.created_at,
      } : {
        id: userId, email,
        credits: 0, plan: 'free' as PlanTier,
        favorites: [], created_at: fallbackCreatedAt,
      })

      const { data: protocols } = await supabase
        .from('protocols').select('*').eq('user_id', userId)
        .order('created_at', { ascending: false })

      setProtocols((protocols || []).map((p: any) => ({
        id: p.id, goal: p.goal, created_at: p.created_at,
        protocol: p.protocol, credits_used: p.credits_used,
        status: p.status || 'active', currentWeek: p.current_week || 1,
      })))

      const { data: stacks } = await supabase
        .from('saved_stacks').select('*').eq('user_id', userId)
        .order('created_at', { ascending: false })

      setSavedStacks((stacks || []).map((s: any): SavedStack => ({
        id: s.id, name: s.name,
        peptide_ids: s.peptide_ids || [],
        node_positions: s.node_positions || null,
        synergy_score: s.synergy_score || null,
        notes: s.notes || null,
        created_at: s.created_at,
      })))
    }

    const init = async () => {
      try {
        // Use getSession first (reads from storage, no network call)
        // Then validate with getUser if session exists
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setUser(null); setProtocols([]); setSavedStacks([])
          return
        }

        // Validate the session is still valid
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          // Session expired but token was in storage — clean up quietly
          await supabase.auth.signOut()
          setUser(null); setProtocols([]); setSavedStacks([])
          return
        }

        await loadUserData(user.id, user.email || '', user.created_at || new Date().toISOString())
      } catch (e) {
        console.error('[Auth] init error', e)
        setUser(null); setProtocols([]); setSavedStacks([])
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null); setProtocols([]); setSavedStacks([])
        return
      }
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
        try {
          await loadUserData(session.user.id, session.user.email || '', session.user.created_at || new Date().toISOString())
        } catch (e) { console.error('[Auth] load error', e) }
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProtocols, setSavedStacks])

  return <>{children}</>
}
