// components/AuthProvider.tsx
'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import type { PlanTier } from '@/lib/utils'
import type { SavedStack } from '@/lib/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setProtocols = useAppStore((s) => s.setProtocols)
  const setSavedStacks = useAppStore((s) => s.setSavedStacks)
  const setAuthReady = useAppStore((s) => s.setAuthReady)
  const loadingRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()

    const loadUserData = async (userId: string, email: string, createdAt: string) => {
      // Prevent concurrent loads from racing
      if (loadingRef.current) return
      loadingRef.current = true

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles').select('*').eq('id', userId).maybeSingle()

        if (profileError) {
          console.error('[Auth] profile query failed:', profileError.message)
          // Profile query failed — set basic user from session so they're at least logged in
          // but DON'T overwrite if we already have user data in the store
          const currentUser = useAppStore.getState().user
          if (!currentUser) {
            setUser({
              id: userId, email,
              credits: 0, plan: 'free' as PlanTier,
              favorites: [], created_at: createdAt,
            })
          }
          return
        }

        setUser(profile ? {
          id: profile.id, email: profile.email,
          credits: profile.credits || 0,
          plan: (profile.plan || 'free') as PlanTier,
          favorites: profile.favorites || [],
          created_at: profile.created_at,
        } : {
          id: userId, email,
          credits: 0, plan: 'free' as PlanTier,
          favorites: [], created_at: createdAt,
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
      } catch (e) {
        console.error('[Auth] loadUserData error:', e)
      } finally {
        loadingRef.current = false
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProtocols([])
        setSavedStacks([])
        setAuthReady(true)
        return
      }

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user) {
          await loadUserData(session.user.id, session.user.email || '', session.user.created_at || new Date().toISOString())
        } else {
          // No session — user is not logged in
          setUser(null)
          setProtocols([])
          setSavedStacks([])
        }
        setAuthReady(true)
        return
      }

      // TOKEN_REFRESHED, USER_UPDATED, etc. — do NOT reload profile.
      // The token changed but user data hasn't. Reloading risks overwriting
      // correct data (e.g. Pro plan) with fallback (Free) if the query fails.
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProtocols, setSavedStacks, setAuthReady])

  return <>{children}</>
}
