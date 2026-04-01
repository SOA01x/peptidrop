// components/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'
import type { SavedStack } from '@/lib/store'

// Shared function so login/signup pages can also load profile data
export async function loadUserProfile(supabase: any, userId: string, email: string, createdAt: string) {
  const store = useAppStore.getState()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', userId).maybeSingle()

  store.setUser(profile ? {
    id: profile.id, email: profile.email,
    full_name: profile.full_name || null,
    credits: profile.credits || 0,
    plan: (profile.plan || 'free') as PlanTier,
    favorites: profile.favorites || [],
    created_at: profile.created_at,
  } : {
    id: userId, email,
    full_name: null,
    credits: 0, plan: 'free' as PlanTier,
    favorites: [], created_at: createdAt,
  })
  store.setAuthReady(true)

  const { data: protocols } = await supabase
    .from('protocols').select('*').eq('user_id', userId)
    .order('created_at', { ascending: false })

  store.setProtocols((protocols || []).map((p: any) => ({
    id: p.id, goal: p.goal, created_at: p.created_at,
    protocol: p.protocol, credits_used: p.credits_used,
    status: p.status || 'active', currentWeek: p.current_week || 1,
  })))

  const { data: stacks } = await supabase
    .from('saved_stacks').select('*').eq('user_id', userId)
    .order('created_at', { ascending: false })

  store.setSavedStacks((stacks || []).map((s: any): SavedStack => ({
    id: s.id, name: s.name,
    peptide_ids: s.peptide_ids || [],
    node_positions: s.node_positions || null,
    synergy_score: s.synergy_score || null,
    notes: s.notes || null,
    created_at: s.created_at,
  })))
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient()

    // Load initial session from localStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(supabase, session.user.id, session.user.email || '', session.user.created_at || new Date().toISOString())
      } else {
        const store = useAppStore.getState()
        store.setUser(null)
        store.setProtocols([])
        store.setSavedStacks([])
        store.setAuthReady(true)
      }
    }).catch(() => {
      useAppStore.getState().setAuthReady(true)
    })

    // Listen for sign-out events (sign-in is handled by login page directly)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        const store = useAppStore.getState()
        store.setUser(null)
        store.setProtocols([])
        store.setSavedStacks([])
        store.setAuthReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
