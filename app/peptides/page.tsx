// app/peptides/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { peptides, peptideCategories, type Category, type Peptide, type RiskLevel } from '@/data/peptides'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function PeptideCard({ peptide, onSelect }: { peptide: Peptide; onSelect: (p: Peptide) => void }) {
  const { favorites, toggleFavorite, addToStack, selectedPeptides, user, credits, deductCredits } = useAppStore()
  const router = useRouter()
  const isFav = favorites.includes(peptide.id)
  const inStack = selectedPeptides.includes(peptide.id)
  const catInfo = peptideCategories[peptide.category]

  const riskColors: Record<RiskLevel, string> = {
    low: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    moderate: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    high: 'text-accent-rose bg-accent-rose/10 border-accent-rose/20',
    'very-high': 'text-red-500 bg-red-500/10 border-red-500/20',
  }

  const handleStack = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      router.push('/signup')
      return
    }
    if (inStack) return
    // Free users can stack (uses credits for basic stacking)
    addToStack(peptide.id)
  }

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) { router.push('/signup'); return }
    toggleFavorite(peptide.id)
  }

  return (
    <div className="glass-panel p-5 sm:p-6 card-hover cursor-pointer group relative" onClick={() => onSelect(peptide)}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">{catInfo.icon}</span>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider" style={{ color: catInfo.color }}>{catInfo.label}</span>
        </div>
        <div className={cn('px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono border', riskColors[peptide.riskProfile])}>
          {peptide.riskProfile}
        </div>
      </div>

      <h3 className="font-display font-semibold text-base sm:text-lg mb-1 group-hover:text-accent-cyan transition-colors">{peptide.name}</h3>
      <p className="text-[10px] sm:text-xs text-text-muted font-mono mb-2 sm:mb-3">{peptide.abbreviation} · {peptide.subcategory}</p>
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3 sm:mb-4 line-clamp-3">{peptide.description}</p>

      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
        {peptide.tags.slice(0, 4).map(tag => (
          <span key={tag} className="px-1.5 sm:px-2 py-0.5 bg-surface-tertiary rounded text-[10px] sm:text-xs text-text-muted">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-surface-border/30">
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-text-muted">
          <span>t½: {peptide.halfLife}</span>
          <span>·</span>
          <span>Stack: <span className="text-accent-cyan font-mono">{peptide.stackScore}/10</span></span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={handleFav}
            className={cn('p-1.5 rounded-lg transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center',
              isFav ? 'text-accent-rose' : 'text-text-muted hover:text-accent-rose')}>
            {isFav ? '♥' : '♡'}
          </button>
          <button onClick={handleStack}
            className={cn('px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all min-h-[32px]',
              inStack ? 'bg-accent-cyan/20 text-accent-cyan' :
              !user ? 'bg-surface-tertiary text-text-muted opacity-60' :
              'bg-surface-tertiary text-text-muted hover:bg-accent-cyan/10 hover:text-accent-cyan')}>
            {inStack ? '✓ Stacked' : !user ? '🔒 Stack' : '+ Stack'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PeptideModal({ peptide, onClose }: { peptide: Peptide; onClose: () => void }) {
  const catInfo = peptideCategories[peptide.category]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative border border-surface-border rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-surface-secondary" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 backdrop-blur-xl border-b border-surface-border/50 p-5 sm:p-6 flex justify-between items-start bg-surface-secondary/95">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{catInfo.icon}</span>
              <span className="text-sm font-mono" style={{ color: catInfo.color }}>{catInfo.label}</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl">{peptide.name}</h2>
            <p className="text-xs sm:text-sm text-text-muted font-mono">{peptide.abbreviation} · {peptide.subcategory}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-tertiary rounded-lg transition-colors text-text-muted min-w-[40px] min-h-[40px] flex items-center justify-center">✕</button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 sm:space-y-8">
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{peptide.description}</p>

          <div>
            <h3 className="font-display font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Mechanism of Action</h3>
            <div className="glass-panel-light p-4"><p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{peptide.mechanism}</p></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-display font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Target Receptors</h3>
              <div className="space-y-2">{peptide.targetReceptors.map(r => (
                <div key={r} className="px-3 py-2 bg-accent-cyan/5 border border-accent-cyan/10 rounded-lg text-xs sm:text-sm text-accent-cyan font-mono">{r}</div>
              ))}</div>
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Pathways</h3>
              <div className="space-y-2">{peptide.pathways.map(p => (
                <div key={p} className="px-3 py-2 bg-accent-violet/5 border border-accent-violet/10 rounded-lg text-xs sm:text-sm text-accent-violet font-mono">{p}</div>
              ))}</div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Effects</h3>
            <div className="flex flex-wrap gap-2">{peptide.effects.map(e => (
              <span key={e} className="px-3 py-1.5 bg-accent-emerald/10 border border-accent-emerald/20 rounded-full text-xs sm:text-sm text-accent-emerald">{e}</span>
            ))}</div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Pharmacokinetics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ label: 'Half-Life', value: peptide.halfLife }, { label: 'Onset', value: peptide.onsetTime },
                { label: 'Peak', value: peptide.peakEffect }, { label: 'Duration', value: peptide.duration }].map(pk => (
                <div key={pk.label} className="glass-panel-light p-3 text-center">
                  <div className="text-[10px] sm:text-xs text-text-muted mb-1">{pk.label}</div>
                  <div className="text-xs sm:text-sm font-mono text-accent-cyan">{pk.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-4 border-accent-amber/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-accent-amber">⚠️</span>
              <h3 className="font-display font-semibold text-sm text-accent-amber">Educational Dosing Reference</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">{peptide.suggestedDosing}</p>
            <p className="text-xs sm:text-sm text-text-muted mt-1">Frequency: {peptide.frequency}</p>
            <p className="text-[10px] sm:text-xs text-text-muted mt-2 italic">For educational purposes only. Not medical advice.</p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm text-text-secondary uppercase tracking-wider mb-3">Side Effects</h3>
            <div className="flex flex-wrap gap-2">{peptide.sideEffects.map(se => (
              <span key={se} className="px-3 py-1.5 bg-accent-rose/10 border border-accent-rose/20 rounded-full text-xs sm:text-sm text-accent-rose">{se}</span>
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PeptidesPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all')
  const [modalPeptide, setModalPeptide] = useState<Peptide | null>(null)

  const filtered = useMemo(() => {
    return peptides.filter(p => {
      const matchSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.includes(search.toLowerCase()))
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory
      const matchRisk = selectedRisk === 'all' || p.riskProfile === selectedRisk
      return matchSearch && matchCat && matchRisk
    })
  }, [search, selectedCategory, selectedRisk])

  const categories = Object.entries(peptideCategories) as [Category, typeof peptideCategories[Category]][]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
            Peptide <span className="text-gradient">Explorer</span>
          </h1>
          <p className="text-text-secondary max-w-xl text-sm sm:text-base">
            Research our comprehensive database. Filter by category, risk level, and search for specific compounds.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <input type="text" placeholder="Search peptides, tags, effects..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field max-w-md" />

          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <button onClick={() => setSelectedCategory('all')}
              className={cn('px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 min-h-[36px]',
                selectedCategory === 'all' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-surface-secondary text-text-muted')}>All</button>
            {categories.map(([key, val]) => (
              <button key={key} onClick={() => setSelectedCategory(key)}
                className={cn('px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 min-h-[36px] whitespace-nowrap',
                  selectedCategory === key ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-surface-secondary text-text-muted')}>
                <span className="text-xs">{val.icon}</span>{val.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(['all', 'low', 'moderate', 'high'] as const).map(risk => (
              <button key={risk} onClick={() => setSelectedRisk(risk)}
                className={cn('px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[36px]',
                  selectedRisk === risk ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-surface-secondary text-text-muted')}>
                {risk === 'all' ? 'All Risks' : risk.charAt(0).toUpperCase() + risk.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-text-muted">
          Showing {filtered.length} of {peptides.length} peptides
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(peptide => (
            <PeptideCard key={peptide.id} peptide={peptide} onSelect={setModalPeptide} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20"><p className="text-text-muted text-lg">No peptides match your filters</p></div>
        )}
      </div>

      {modalPeptide && <PeptideModal peptide={modalPeptide} onClose={() => setModalPeptide(null)} />}
      <Footer />
    </main>
  )
}
