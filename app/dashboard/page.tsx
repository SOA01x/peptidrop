// app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { peptides, getPeptideById, getStackCompatibility, peptideCategories } from '@/data/peptides'
import { CREDIT_PACKAGES, cn } from '@/lib/utils'
import Link from 'next/link'

function CreditsCard() {
  const { credits } = useAppStore()
  return (
    <div className="glass-panel glow-border p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent-cyan/5 rounded-full blur-[60px]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-sm text-text-secondary font-display">Available Credits</span>
        </div>
        <div className="text-5xl font-display font-bold text-gradient mb-4">{credits}</div>
        <p className="text-sm text-text-muted mb-6">Each protocol generation uses 1 credit</p>
        <Link href="#buy-credits" className="btn-primary text-sm py-2.5 inline-block">
          Buy Credits
        </Link>
      </div>
    </div>
  )
}

function QuickActions() {
  return (
    <div className="glass-panel p-8">
      <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link href="/generator" className="flex items-center gap-4 p-4 bg-surface-tertiary rounded-xl hover:bg-accent-cyan/5 hover:border-accent-cyan/20 border border-transparent transition-all group">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Generate Protocol</p>
            <p className="text-xs text-text-muted">AI-powered stack generation</p>
          </div>
        </Link>
        <Link href="/peptides" className="flex items-center gap-4 p-4 bg-surface-tertiary rounded-xl hover:bg-accent-violet/5 hover:border-accent-violet/20 border border-transparent transition-all group">
          <span className="text-2xl">🔍</span>
          <div>
            <p className="font-display font-semibold text-sm group-hover:text-accent-violet transition-colors">Explore Peptides</p>
            <p className="text-xs text-text-muted">Browse the full database</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

function ProtocolHistory() {
  const { protocols } = useAppStore()

  return (
    <div className="glass-panel p-8">
      <h3 className="font-display font-semibold text-lg mb-4">Protocol History</h3>
      {protocols.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-4">📋</span>
          <p className="text-text-muted text-sm">No protocols generated yet</p>
          <Link href="/generator" className="text-accent-cyan text-sm hover:underline mt-2 inline-block">
            Generate your first protocol →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {protocols.map((p) => (
            <div key={p.id} className="p-4 bg-surface-tertiary rounded-xl flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-sm">{p.goal}</p>
                <p className="text-xs text-text-muted">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <button className="text-accent-cyan text-sm hover:underline">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FavoritePeptides() {
  const { favorites } = useAppStore()
  const favPeptides = favorites.map(id => getPeptideById(id)).filter(Boolean)

  return (
    <div className="glass-panel p-8">
      <h3 className="font-display font-semibold text-lg mb-4">Favorite Peptides</h3>
      {favPeptides.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-3xl block mb-3">♡</span>
          <p className="text-text-muted text-sm">No favorites yet</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
          {favPeptides.map(p => {
            if (!p) return null
            const cat = peptideCategories[p.category]
            return (
              <div key={p.id} className="min-w-[200px] p-4 bg-surface-tertiary rounded-xl flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <span>{cat.icon}</span>
                  <span className="text-xs font-mono" style={{ color: cat.color }}>{p.abbreviation}</span>
                </div>
                <p className="font-display font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-text-muted mt-1">{p.halfLife} half-life</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StackVisualization() {
  const { selectedPeptides, removeFromStack, clearStack } = useAppStore()
  const stackPeptides = selectedPeptides.map(id => getPeptideById(id)).filter(Boolean)
  const compatibility = selectedPeptides.length >= 2 ? getStackCompatibility(selectedPeptides) : null

  return (
    <div className="glass-panel p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Stack Builder</h3>
        {selectedPeptides.length > 0 && (
          <button onClick={clearStack} className="text-xs text-text-muted hover:text-accent-rose transition-colors">
            Clear All
          </button>
        )}
      </div>

      {stackPeptides.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-4">🧬</span>
          <p className="text-text-muted text-sm">Add peptides from the Explorer to build a stack</p>
          <Link href="/peptides" className="text-accent-cyan text-sm hover:underline mt-2 inline-block">
            Browse Peptides →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stack Items */}
          <div className="space-y-2">
            {stackPeptides.map(p => {
              if (!p) return null
              const cat = peptideCategories[p.category]
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-surface-tertiary rounded-xl">
                  <div className="flex items-center gap-3">
                    <span>{cat.icon}</span>
                    <div>
                      <p className="font-display font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.abbreviation}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromStack(p.id)}
                    className="text-text-muted hover:text-accent-rose text-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          {/* Compatibility Score */}
          {compatibility && (
            <div className="p-4 bg-surface-tertiary rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-display font-medium text-text-secondary">Compatibility Score</span>
                <span className={cn(
                  'text-lg font-display font-bold',
                  compatibility.score >= 6 ? 'text-accent-emerald' :
                  compatibility.score >= 3 ? 'text-accent-amber' : 'text-accent-rose'
                )}>
                  {compatibility.score}/10
                </span>
              </div>

              {compatibility.synergies.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-accent-emerald font-mono">Synergies:</span>
                  {compatibility.synergies.map((s, i) => (
                    <p key={i} className="text-xs text-text-muted ml-2">+ {s[0]} ↔ {s[1]}</p>
                  ))}
                </div>
              )}

              {compatibility.conflicts.length > 0 && (
                <div>
                  <span className="text-xs text-accent-rose font-mono">Conflicts:</span>
                  {compatibility.conflicts.map((c, i) => (
                    <p key={i} className="text-xs text-text-muted ml-2">⚠ {c[0]} ↔ {c[1]}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CreditStore() {
  return (
    <div id="buy-credits" className="scroll-mt-28">
      <h2 className="font-display font-bold text-2xl mb-6">Buy Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={cn(
              'glass-panel p-8 relative card-hover',
              pkg.popular && 'glow-border'
            )}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full text-xs font-display font-semibold text-surface">
                Most Popular
              </div>
            )}
            <h3 className="font-display font-bold text-lg mb-1">{pkg.label}</h3>
            <p className="text-text-muted text-sm mb-4">{pkg.description}</p>
            <div className="mb-6">
              <span className="text-3xl font-display font-bold text-gradient">${pkg.price}</span>
              <span className="text-text-muted text-sm ml-2">/ {pkg.credits} credits</span>
            </div>
            <div className="mb-4 text-xs text-text-muted">
              <p>Accepted: USDC · USDT · BTC · SOL</p>
            </div>
            <button className={cn(
              'w-full py-3 rounded-xl font-display font-semibold text-sm transition-all',
              pkg.popular ? 'btn-primary' : 'btn-secondary'
            )}>
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary">Manage your protocols, credits, and peptide research.</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1 space-y-6">
            <CreditsCard />
            <QuickActions />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ProtocolHistory />
            <FavoritePeptides />
          </div>
        </div>

        {/* Stack Visualization */}
        <div className="mb-12">
          <StackVisualization />
        </div>

        {/* Credit Store */}
        <CreditStore />
      </div>

      <Footer />
    </main>
  )
}
