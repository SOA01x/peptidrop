// lib/store.ts
import { create } from 'zustand'
import type { Peptide } from '@/data/peptides'

interface UserProfile {
  id: string
  email: string
  credits: number
  favorites: string[]
  created_at: string
}

interface GeneratedProtocol {
  id: string
  goal: string
  created_at: string
  protocol: any
  credits_used: number
}

interface AppState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  credits: number
  setCredits: (credits: number) => void
  deductCredits: (amount: number) => void
  favorites: string[]
  toggleFavorite: (peptideId: string) => void
  setFavorites: (favorites: string[]) => void
  protocols: GeneratedProtocol[]
  addProtocol: (protocol: GeneratedProtocol) => void
  setProtocols: (protocols: GeneratedProtocol[]) => void
  selectedPeptides: string[]
  addToStack: (peptideId: string) => void
  removeFromStack: (peptideId: string) => void
  clearStack: () => void
  isGenerating: boolean
  setIsGenerating: (v: boolean) => void
  generationStep: string
  setGenerationStep: (step: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user, credits: user?.credits ?? 0, favorites: user?.favorites ?? [] }),
  credits: 0,
  setCredits: (credits) => set({ credits }),
  deductCredits: (amount) => set((s) => ({ credits: Math.max(0, s.credits - amount) })),
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
  selectedPeptides: [],
  addToStack: (peptideId) => set((s) => ({
    selectedPeptides: s.selectedPeptides.includes(peptideId)
      ? s.selectedPeptides
      : [...s.selectedPeptides, peptideId]
  })),
  removeFromStack: (peptideId) => set((s) => ({
    selectedPeptides: s.selectedPeptides.filter(p => p !== peptideId)
  })),
  clearStack: () => set({ selectedPeptides: [] }),
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  generationStep: '',
  setGenerationStep: (step) => set({ generationStep: step }),
}))
