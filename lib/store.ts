// lib/store.ts
import { create } from 'zustand'
import type { PlanTier } from '@/lib/utils'

interface UserProfile {
  id: string
  email: string
  credits: number
  plan: PlanTier
  favorites: string[]
  created_at: string
}

interface GeneratedProtocol {
  id: string
  goal: string
  created_at: string
  protocol: any
  credits_used: number
  status?: 'active' | 'completed' | 'paused'
  currentWeek?: number
}

interface ProgressEntry {
  id: string
  protocol_id: string
  week: number
  notes: string
  rating: number
  adjustments?: string
  date: string
}

interface StackBuilderNode {
  peptideId: string
  x: number
  y: number
}

export interface SavedStack {
  id: string
  name: string
  peptide_ids: string[]
  node_positions: StackBuilderNode[] | null
  synergy_score: number | null
  notes: string | null
  created_at: string
}

interface AppState {
  // Auth
  authReady: boolean
  setAuthReady: (ready: boolean) => void
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void

  // Credits & Plan
  credits: number
  setCredits: (credits: number) => void
  deductCredits: (amount: number) => void
  plan: PlanTier
  setPlan: (plan: PlanTier) => void

  // Favorites
  favorites: string[]
  toggleFavorite: (peptideId: string) => void
  setFavorites: (favorites: string[]) => void

  // Protocols
  protocols: GeneratedProtocol[]
  addProtocol: (protocol: GeneratedProtocol) => void
  setProtocols: (protocols: GeneratedProtocol[]) => void
  updateProtocolWeek: (id: string, week: number) => void

  // Progress Tracking
  progressEntries: ProgressEntry[]
  addProgressEntry: (entry: ProgressEntry) => void
  setProgressEntries: (entries: ProgressEntry[]) => void

  // Stack Builder (current working stack)
  selectedPeptides: string[]
  stackNodes: StackBuilderNode[]
  addToStack: (peptideId: string) => void
  removeFromStack: (peptideId: string) => void
  clearStack: () => void
  updateNodePosition: (peptideId: string, x: number, y: number) => void
  loadStackFromSaved: (stack: SavedStack) => void

  // Saved Stacks (persisted to Supabase)
  savedStacks: SavedStack[]
  setSavedStacks: (stacks: SavedStack[]) => void
  addSavedStack: (stack: SavedStack) => void
  removeSavedStack: (id: string) => void

  // UI State
  isGenerating: boolean
  setIsGenerating: (v: boolean) => void
  generationStep: string
  setGenerationStep: (step: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  authReady: false,
  setAuthReady: (ready) => set({ authReady: ready }),
  user: null,
  setUser: (user) => set({
    user,
    credits: user?.credits ?? 0,
    favorites: user?.favorites ?? [],
    plan: user?.plan ?? 'free',
  }),

  credits: 0,
  setCredits: (credits) => set({ credits }),
  deductCredits: (amount) => set((s) => ({ credits: Math.max(0, s.credits - amount) })),
  plan: 'free',
  setPlan: (plan) => set({ plan }),

  favorites: [],
  toggleFavorite: (peptideId) => set((s) => ({
    favorites: s.favorites.includes(peptideId)
      ? s.favorites.filter(f => f !== peptideId)
      : [...s.favorites, peptideId]
  })),
  setFavorites: (favorites) => set({ favorites }),

  protocols: [],
  addProtocol: (protocol) => set((s) => ({ protocols: [protocol, ...s.protocols] })),
  setProtocols: (protocols) => set({ protocols }),
  updateProtocolWeek: (id, week) => set((s) => ({
    protocols: s.protocols.map(p => p.id === id ? { ...p, currentWeek: week } : p)
  })),

  progressEntries: [],
  addProgressEntry: (entry) => set((s) => ({ progressEntries: [...s.progressEntries, entry] })),
  setProgressEntries: (entries) => set({ progressEntries: entries }),

  selectedPeptides: [],
  stackNodes: [],
  addToStack: (peptideId) => set((s) => {
    if (s.selectedPeptides.includes(peptideId)) return s
    const angle = (s.stackNodes.length * 72) * (Math.PI / 180)
    const r = 120
    return {
      selectedPeptides: [...s.selectedPeptides, peptideId],
      stackNodes: [...s.stackNodes, {
        peptideId,
        x: 250 + Math.cos(angle) * r,
        y: 200 + Math.sin(angle) * r,
      }],
    }
  }),
  removeFromStack: (peptideId) => set((s) => ({
    selectedPeptides: s.selectedPeptides.filter(p => p !== peptideId),
    stackNodes: s.stackNodes.filter(n => n.peptideId !== peptideId),
  })),
  clearStack: () => set({ selectedPeptides: [], stackNodes: [] }),
  updateNodePosition: (peptideId, x, y) => set((s) => ({
    stackNodes: s.stackNodes.map(n => n.peptideId === peptideId ? { ...n, x, y } : n),
  })),
  loadStackFromSaved: (stack) => {
    const nodes = stack.node_positions || stack.peptide_ids.map((id, i) => {
      const angle = (i * 72) * (Math.PI / 180)
      return { peptideId: id, x: 250 + Math.cos(angle) * 120, y: 200 + Math.sin(angle) * 120 }
    })
    set({ selectedPeptides: [...stack.peptide_ids], stackNodes: nodes })
  },

  savedStacks: [],
  setSavedStacks: (stacks) => set({ savedStacks: stacks }),
  addSavedStack: (stack) => set((s) => ({ savedStacks: [stack, ...s.savedStacks] })),
  removeSavedStack: (id) => set((s) => ({ savedStacks: s.savedStacks.filter(st => st.id !== id) })),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  generationStep: '',
  setGenerationStep: (step) => set({ generationStep: step }),
}))
