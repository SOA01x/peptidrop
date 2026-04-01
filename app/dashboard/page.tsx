// app/dashboard/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { getPeptideById, getStackCompatibility, type Peptide } from '@/data/peptides'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

// ============================================
// PAYWALL
// ============================================
function PaywallSection({ children, title, description, requiresPro = true }: {
  children: React.ReactNode; title: string; description: string; requiresPro?: boolean
}) {
  const { user, plan } = useAppStore()
  const showPaywall = requiresPro ? (!user || plan === 'free') : !user
  const upgradeLabel = plan === 'researcher' ? 'Upgrade to Pro' : 'Upgrade'
  if (!showPaywall) return <>{children}</>
  return (
    <div className="relative">
      <div className="blur-md pointer-events-none select-none opacity-40">{children}</div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-surface/60 backdrop-blur-sm">
        <div className="text-center px-6 max-w-md">
          <span className="text-3xl block mb-3">🔒</span>
          <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
          <p className="text-text-muted text-sm mb-5">{description}</p>
          {!user ? (
            <Link href="/signup" className="btn-primary text-sm">Sign Up Free</Link>
          ) : (
            <Link href="/pricing" className="btn-primary text-sm">{upgradeLabel}</Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// PLAN CARD - No credits, just plan status
// ============================================
function PlanCard() {
  const { plan } = useAppStore()
  return (
    <div className="glass-panel glow-border p-5 sm:p-8 relative overflow-hidden">
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn('w-3 h-3 rounded-full animate-pulse',
            plan === 'pro' ? 'bg-accent-cyan' : plan === 'researcher' ? 'bg-accent-violet' : 'bg-accent-emerald'
          )} />
          <span className="text-sm text-text-secondary font-display">Current Plan</span>
        </div>
        {plan === 'pro' ? (
          <>
            <div className="text-4xl sm:text-5xl font-display font-bold text-gradient mb-2">Pro</div>
            <p className="text-sm text-text-muted mb-5">Full research suite with reports, stacks, and risk simulation</p>
            <Link href="/generator" className="btn-primary text-sm">Generate Protocol</Link>
          </>
        ) : plan === 'researcher' ? (
          <>
            <div className="text-4xl sm:text-5xl font-display font-bold text-accent-violet mb-2">Researcher</div>
            <p className="text-sm text-text-muted mb-5">AI protocols, tracking, and progress journal</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/generator" className="btn-primary text-sm">Generate Protocol</Link>
              <Link href="/pricing" className="btn-secondary text-sm">Upgrade to Pro</Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-display font-bold text-text-muted mb-2">Free</div>
            <p className="text-sm text-text-muted mb-5">Upgrade for AI protocols and full access</p>
            <Link href="/pricing" className="btn-primary text-sm">Upgrade - Starting at $19/mo</Link>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================
// QUICK ACTIONS
// ============================================
function QuickActions() {
  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-4">Quick Actions</h3>
      <div className="space-y-2 sm:space-y-3">
        <Link href="/generator" className="flex items-center gap-3 p-3 sm:p-4 bg-surface-tertiary rounded-xl border border-transparent transition-all group">
          <span className="text-xl">⚡</span>
          <div>
            <p className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Generate Protocol</p>
            <p className="text-xs text-text-muted">AI-powered stack generation</p>
          </div>
        </Link>
        <Link href="/peptides" className="flex items-center gap-3 p-3 sm:p-4 bg-surface-tertiary rounded-xl border border-transparent transition-all group">
          <span className="text-xl">🔍</span>
          <div>
            <p className="font-display font-semibold text-sm group-hover:text-accent-violet transition-colors">Explore Peptides</p>
            <p className="text-xs text-text-muted">Browse 345+ compounds</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ============================================
// PROTOCOL HISTORY - REAL DATA, CLICKABLE
// ============================================
function ProtocolTimeline() {
  const { protocols } = useAppStore()

  if (protocols.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-8">
        <h3 className="font-display font-semibold text-base sm:text-lg mb-6 flex items-center gap-2">
          <span>📋</span> Protocol History
        </h3>
        <div className="text-center py-12">
          <span className="text-4xl block mb-4">📋</span>
          <h4 className="font-display font-semibold text-base mb-2">No protocols yet</h4>
          <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">Generate your first AI protocol to see it here.</p>
          <Link href="/generator" className="btn-primary text-sm">Generate Your First Protocol</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-6 flex items-center gap-2">
        <span>📋</span> Protocol History
        <span className="text-xs font-mono text-text-muted ml-auto">{protocols.length} total</span>
      </h3>
      <div className="relative">
        <div className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/30 to-transparent" />
        <div className="space-y-4">
          {protocols.map((p: any) => (
            <Link key={p.id} href={`/protocol/${p.id}`} className="relative pl-10 sm:pl-14 block group">
              <div className={cn('absolute left-2.5 sm:left-3.5 top-4 w-3 h-3 rounded-full border-2 border-surface',
                p.status === 'active' ? 'bg-accent-emerald' : p.status === 'completed' ? 'bg-accent-cyan' : 'bg-accent-amber'
              )} />
              <div className="glass-panel-light p-4 sm:p-5 card-hover">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">{p.goal}</h4>
                    <p className="text-xs text-text-muted">{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-mono',
                    p.status === 'active' ? 'text-accent-emerald bg-accent-emerald/10' :
                    p.status === 'completed' ? 'text-accent-cyan bg-accent-cyan/10' : 'text-accent-amber bg-accent-amber/10'
                  )}>{p.status || 'active'}</span>
                </div>
                {p.protocol?.coreStack && (
                  <div className="flex flex-wrap gap-1">
                    {p.protocol.coreStack.slice(0, 4).map((s: any, j: number) => (
                      <span key={j} className="px-2 py-0.5 rounded text-[10px] text-text-muted font-mono bg-surface-tertiary">{s.name}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-accent-cyan mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to view full details →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// PEPTIDE SYNERGY MAPPING - Pro Feature
// ============================================
function PeptideSynergyMap() {
  const { selectedPeptides, stackNodes, removeFromStack, clearStack, addToStack, updateNodePosition,
    savedStacks, addSavedStack, removeSavedStack, loadStackFromSaved, user, plan } = useAppStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [stackName, setStackName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const allPeptides = require('@/data/peptides').peptides as Peptide[]
  const stackPeptides = selectedPeptides.map(id => getPeptideById(id)).filter(Boolean) as Peptide[]
  const compatibility = selectedPeptides.length >= 2 ? getStackCompatibility(selectedPeptides) : null

  const filteredPeptides = allPeptides
    .filter(p => !selectedPeptides.includes(p.id))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.abbreviation.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 20)

  const connections: Array<{ from: string; to: string; type: 'synergy' | 'conflict'; key: string }> = []
  for (let i = 0; i < stackPeptides.length; i++) {
    for (let j = i + 1; j < stackPeptides.length; j++) {
      const a = stackPeptides[i], b = stackPeptides[j]
      if (a.synergisticWith.includes(b.id) || b.synergisticWith.includes(a.id))
        connections.push({ from: a.id, to: b.id, type: 'synergy', key: `${a.id}-${b.id}` })
      if (a.conflictsWith.includes(b.id) || b.conflictsWith.includes(a.id))
        connections.push({ from: a.id, to: b.id, type: 'conflict', key: `${a.id}-${b.id}` })
    }
  }

  const riskColors: Record<string, string> = { low: '#4ade80', moderate: '#e8c547', high: '#ef4444', 'very-high': '#FF0040' }
  const getNode = (id: string) => stackNodes.find(n => n.peptideId === id)

  const handleAdd = (id: string) => {
    addToStack(id)
    setSearch('')
    setDropdownOpen(false)
    setAnimKey(k => k + 1)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMouseDown = (peptideId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const node = getNode(peptideId)
    if (!node || !svgRef.current) return
    const svg = svgRef.current; const pt = svg.createSVGPoint()
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
    pt.x = cx; pt.y = cy
    const sp = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    setDragging(peptideId); setDragOffset({ x: sp.x - node.x, y: sp.y - node.y })
  }

  useEffect(() => {
    if (!dragging) return
    const move = (e: MouseEvent | TouchEvent) => {
      if (!svgRef.current) return
      const svg = svgRef.current; const pt = svg.createSVGPoint()
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      pt.x = cx; pt.y = cy
      const sp = pt.matrixTransform(svg.getScreenCTM()?.inverse())
      updateNodePosition(dragging, sp.x - dragOffset.x, sp.y - dragOffset.y)
    }
    const up = () => setDragging(null)
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up) }
  }, [dragging, dragOffset, updateNodePosition])

  const handleSave = async () => {
    if (!user || !stackName.trim() || selectedPeptides.length === 0) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('saved_stacks')
        .insert({ user_id: user.id, name: stackName.trim(), peptide_ids: selectedPeptides, node_positions: stackNodes, synergy_score: compatibility?.score || null })
        .select().single()
      if (!error && data) {
        addSavedStack({ id: data.id, name: data.name, peptide_ids: data.peptide_ids, node_positions: data.node_positions, synergy_score: data.synergy_score, notes: null, created_at: data.created_at })
        setStackName(''); setShowSaveForm(false)
      }
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    try { const s = createClient(); await s.from('saved_stacks').delete().eq('id', id); removeSavedStack(id) } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel p-5 sm:p-8 relative overflow-hidden">
        {/* Ambient glow background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #e8c547, transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }} />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl flex items-center gap-2">
                <span className="text-accent-cyan">&#9670;</span> Peptide Synergy Mapping
              </h3>
              <p className="text-xs text-text-muted mt-1">Real-time interaction analysis - synergies, conflicts, compatibility</p>
            </div>
            <div className="flex gap-2 items-center">
              {selectedPeptides.length > 0 && (
                <>
                  <button onClick={() => setShowSaveForm(!showSaveForm)} className="text-xs text-accent-cyan px-3 py-1.5 rounded-lg border border-accent-cyan/20 hover:bg-accent-cyan/5 transition-colors">Save Map</button>
                  <button onClick={clearStack} className="text-xs text-text-muted hover:text-accent-rose px-3 py-1.5 rounded-lg border border-surface-border hover:border-accent-rose/20 transition-colors">Clear</button>
                </>
              )}
            </div>
          </div>

          {showSaveForm && (
            <div className="mb-4 p-3 rounded-xl flex gap-2 bg-surface-tertiary border border-surface-border">
              <input type="text" value={stackName} onChange={(e) => setStackName(e.target.value)} placeholder="Name your synergy map..." className="input-field !min-h-[36px] !py-1.5 !text-sm flex-1" />
              <button onClick={handleSave} disabled={saving || !stackName.trim()} className="btn-primary !py-1.5 !px-4 text-xs disabled:opacity-50">{saving ? '...' : 'Save'}</button>
            </div>
          )}

          {/* Peptide Dropdown Selector */}
          <div className="relative mb-4" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-tertiary border border-surface-border hover:border-accent-cyan/30 transition-all text-sm"
            >
              <span className="text-text-muted">
                {selectedPeptides.length === 0 ? 'Select peptides to map synergies...' : `${selectedPeptides.length} peptide${selectedPeptides.length > 1 ? 's' : ''} selected - add more`}
              </span>
              <span className="text-text-muted text-xs">{dropdownOpen ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute z-30 top-full left-0 right-0 mt-1 rounded-xl bg-surface-secondary border border-surface-border shadow-xl max-h-64 overflow-hidden">
                <div className="p-2 border-b border-surface-border">
                  <input
                    type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search 345+ peptides..." autoFocus
                    className="w-full px-3 py-2 rounded-lg bg-surface-tertiary text-sm text-text-primary placeholder:text-text-muted outline-none border border-surface-border focus:border-accent-cyan/30 transition-colors"
                  />
                </div>
                <div className="overflow-y-auto max-h-48">
                  {filteredPeptides.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAdd(p.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-tertiary transition-colors group"
                    >
                      <span className={cn('w-2 h-2 rounded-full flex-shrink-0')} style={{ backgroundColor: riskColors[p.riskProfile] || '#e8c547' }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-text-primary group-hover:text-accent-cyan transition-colors">{p.name}</span>
                        <span className="text-xs text-text-muted ml-2">{p.abbreviation}</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">{p.riskProfile}</span>
                    </button>
                  ))}
                  {filteredPeptides.length === 0 && (
                    <div className="px-4 py-6 text-center text-text-muted text-sm">No peptides found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Synergy Visualization */}
          {stackPeptides.length === 0 ? (
            <div className="text-center py-14 relative">
              <div className="relative inline-block mb-4">
                <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto opacity-20">
                  <circle cx="35" cy="40" r="12" fill="none" stroke="#e8c547" strokeWidth="1.5" />
                  <circle cx="85" cy="40" r="12" fill="none" stroke="#4ade80" strokeWidth="1.5" />
                  <circle cx="60" cy="85" r="12" fill="none" stroke="#e8c547" strokeWidth="1.5" />
                  <line x1="47" y1="40" x2="73" y2="40" stroke="#e8c547" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
                  <line x1="42" y1="50" x2="53" y2="77" stroke="#4ade80" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
                  <line x1="78" y1="50" x2="67" y2="77" stroke="#e8c547" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
                </svg>
              </div>
              <p className="text-text-muted text-sm mb-1">Select peptides from the dropdown above</p>
              <p className="text-text-muted/60 text-xs">Discover synergistic pairs, potential conflicts, and stack compatibility</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border mb-4 overflow-hidden bg-surface border-surface-border relative" style={{ background: 'radial-gradient(ellipse at center, rgba(232,197,71,0.02) 0%, rgba(13,27,42,0.5) 70%)' }}>
                {/* SVG animated defs */}
                <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-[280px] sm:h-[360px] touch-none select-none" key={animKey}>
                  <defs>
                    <filter id="glow-syn">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glow-conf">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="node-glow">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="syn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#e8c547" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="conf-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#ff6b6b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Grid pattern */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  </pattern>
                  <rect width="500" height="400" fill="url(#grid)" />

                  {/* Connection lines with animation */}
                  {connections.map((c) => {
                    const f = getNode(c.from), t = getNode(c.to)
                    if (!f || !t) return null
                    const isHovered = hoveredConnection === c.key
                    const isSynergy = c.type === 'synergy'
                    return (
                      <g key={c.key}
                        onMouseEnter={() => setHoveredConnection(c.key)}
                        onMouseLeave={() => setHoveredConnection(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Glow behind line */}
                        <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                          stroke={isSynergy ? '#4ade80' : '#ef4444'}
                          strokeWidth={isHovered ? 8 : 4} opacity={isHovered ? 0.15 : 0.08}
                          filter={isSynergy ? 'url(#glow-syn)' : 'url(#glow-conf)'}
                        />
                        {/* Main line */}
                        <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                          stroke={isSynergy ? 'url(#syn-grad)' : 'url(#conf-grad)'}
                          strokeWidth={isHovered ? 3 : 2}
                          strokeDasharray={isSynergy ? 'none' : '8 5'}
                          opacity={isHovered ? 1 : 0.7}
                          className="transition-all duration-300"
                        >
                          {isSynergy && (
                            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                          )}
                        </line>
                        {/* Label */}
                        {isHovered && (
                          <g>
                            <rect x={(f.x + t.x) / 2 - 30} y={(f.y + t.y) / 2 - 10} width="60" height="20" rx="6"
                              fill={isSynergy ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)'}
                              stroke={isSynergy ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'} strokeWidth="1"
                            />
                            <text x={(f.x + t.x) / 2} y={(f.y + t.y) / 2 + 4} textAnchor="middle" fill={isSynergy ? '#4ade80' : '#ef4444'} fontSize="8" fontFamily="monospace" fontWeight="600">
                              {isSynergy ? 'SYNERGY' : 'CONFLICT'}
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}

                  {/* Nodes */}
                  {stackNodes.map(n => {
                    const p = getPeptideById(n.peptideId)
                    if (!p) return null
                    const col = riskColors[p.riskProfile] || '#e8c547'
                    const synCount = connections.filter(c => (c.from === n.peptideId || c.to === n.peptideId) && c.type === 'synergy').length
                    const confCount = connections.filter(c => (c.from === n.peptideId || c.to === n.peptideId) && c.type === 'conflict').length

                    return (
                      <g key={n.peptideId}
                        onMouseDown={(e) => handleMouseDown(n.peptideId, e)}
                        onTouchStart={(e) => handleMouseDown(n.peptideId, e)}
                        style={{ cursor: 'grab' }}
                      >
                        {/* Pulse ring */}
                        <circle cx={n.x} cy={n.y} r="32" fill="none" stroke={col} strokeWidth="1" opacity="0.15">
                          <animate attributeName="r" values="32;38;32" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                        </circle>
                        {/* Ambient glow */}
                        <circle cx={n.x} cy={n.y} r="30" fill={col} opacity="0.06" filter="url(#node-glow)" />
                        {/* Main node */}
                        <circle cx={n.x} cy={n.y} r="26" fill="rgba(13,27,42,0.9)" stroke={col} strokeWidth="2.5" />
                        {/* Inner ring */}
                        <circle cx={n.x} cy={n.y} r="21" fill="none" stroke={col} strokeWidth="0.5" opacity="0.3" />
                        {/* Label */}
                        <text x={n.x} y={n.y - 3} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="700">
                          {p.abbreviation.substring(0, 7)}
                        </text>
                        {/* Synergy/conflict indicator */}
                        <text x={n.x} y={n.y + 9} textAnchor="middle" fill={col} fontSize="6.5" fontFamily="monospace" opacity="0.8">
                          {p.riskProfile}
                        </text>
                        {/* Badge: synergy count */}
                        {synCount > 0 && (
                          <g>
                            <circle cx={n.x + 20} cy={n.y - 18} r="7" fill="rgba(74,222,128,0.2)" stroke="#4ade80" strokeWidth="1" />
                            <text x={n.x + 20} y={n.y - 16} textAnchor="middle" dominantBaseline="middle" fill="#4ade80" fontSize="7" fontWeight="700">{synCount}</text>
                          </g>
                        )}
                        {confCount > 0 && (
                          <g>
                            <circle cx={n.x - 20} cy={n.y - 18} r="7" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1" />
                            <text x={n.x - 20} y={n.y - 16} textAnchor="middle" dominantBaseline="middle" fill="#ef4444" fontSize="7" fontWeight="700">{confCount}</text>
                          </g>
                        )}
                        {/* Remove button */}
                        <g onClick={(e) => { e.stopPropagation(); removeFromStack(n.peptideId) }} style={{ cursor: 'pointer' }}>
                          <circle cx={n.x + 20} cy={n.y + 18} r="7" fill="rgba(13,27,42,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                          <text x={n.x + 20} y={n.y + 19.5} textAnchor="middle" dominantBaseline="middle" fill="#6B7280" fontSize="9">x</text>
                        </g>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Stats Bar */}
              {compatibility && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl p-3 text-center border transition-all" style={{
                    background: compatibility.score >= 7 ? 'rgba(74,222,128,0.05)' : compatibility.score >= 4 ? 'rgba(232,197,71,0.05)' : 'rgba(239,68,68,0.05)',
                    borderColor: compatibility.score >= 7 ? 'rgba(74,222,128,0.15)' : compatibility.score >= 4 ? 'rgba(232,197,71,0.15)' : 'rgba(239,68,68,0.15)',
                  }}>
                    <div className="text-[10px] text-text-muted mb-1 uppercase tracking-wider">Compatibility</div>
                    <div className={cn('text-xl font-display font-bold',
                      compatibility.score >= 7 ? 'text-accent-emerald' : compatibility.score >= 4 ? 'text-accent-cyan' : 'text-accent-rose'
                    )}>{compatibility.score}/10</div>
                  </div>
                  <div className="rounded-xl p-3 text-center border border-accent-cyan/10" style={{ background: 'rgba(232,197,71,0.03)' }}>
                    <div className="text-[10px] text-text-muted mb-1 uppercase tracking-wider">Synergies</div>
                    <div className="text-xl font-display font-bold text-accent-emerald">{compatibility.synergies.length}</div>
                  </div>
                  <div className="rounded-xl p-3 text-center border border-surface-border" style={{ background: compatibility.conflicts.length > 0 ? 'rgba(239,68,68,0.03)' : 'rgba(74,222,128,0.03)' }}>
                    <div className="text-[10px] text-text-muted mb-1 uppercase tracking-wider">Conflicts</div>
                    <div className={cn('text-xl font-display font-bold', compatibility.conflicts.length > 0 ? 'text-accent-rose' : 'text-accent-emerald')}>{compatibility.conflicts.length}</div>
                  </div>
                </div>
              )}

              {/* Synergy/Conflict Details */}
              {compatibility && (compatibility.synergies.length > 0 || compatibility.conflicts.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {compatibility.synergies.length > 0 && (
                    <div className="rounded-xl p-3 border border-accent-emerald/10" style={{ background: 'rgba(74,222,128,0.03)' }}>
                      <h4 className="text-xs font-display font-semibold text-accent-emerald mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" /> Synergistic Pairs
                      </h4>
                      {compatibility.synergies.map((pair, i) => {
                        const a = getPeptideById(pair[0]), b = getPeptideById(pair[1])
                        return (
                          <p key={i} className="text-xs text-text-secondary mb-1">
                            <span className="font-mono text-accent-emerald">{a?.abbreviation}</span>
                            <span className="text-text-muted mx-1">+</span>
                            <span className="font-mono text-accent-emerald">{b?.abbreviation}</span>
                          </p>
                        )
                      })}
                    </div>
                  )}
                  {compatibility.conflicts.length > 0 && (
                    <div className="rounded-xl p-3 border border-accent-rose/10" style={{ background: 'rgba(239,68,68,0.03)' }}>
                      <h4 className="text-xs font-display font-semibold text-accent-rose mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-rose" /> Potential Conflicts
                      </h4>
                      {compatibility.conflicts.map((pair, i) => {
                        const a = getPeptideById(pair[0]), b = getPeptideById(pair[1])
                        return (
                          <p key={i} className="text-xs text-text-secondary mb-1">
                            <span className="font-mono text-accent-rose">{a?.abbreviation}</span>
                            <span className="text-text-muted mx-1">vs</span>
                            <span className="font-mono text-accent-rose">{b?.abbreviation}</span>
                          </p>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Saved Maps */}
      {savedStacks.length > 0 && (
        <div className="glass-panel p-5 sm:p-8">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <span className="text-accent-cyan">&#9670;</span> Saved Synergy Maps
          </h3>
          <div className="space-y-3">
            {savedStacks.map(st => (
              <div key={st.id} className="p-3 rounded-xl bg-surface-tertiary border border-surface-border flex items-center justify-between gap-3 group hover:border-accent-cyan/20 transition-colors">
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-sm">{st.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {st.peptide_ids.map(id => { const p = getPeptideById(id); return p ? <span key={id} className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-surface/50">{p.abbreviation}</span> : null })}
                  </div>
                  {st.synergy_score && <span className="text-[10px] text-accent-emerald font-mono mt-1 inline-block">Score: {st.synergy_score}/10</span>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => loadStackFromSaved(st)} className="text-xs text-accent-cyan hover:underline">Load</button>
                  <button onClick={() => handleDelete(st.id)} className="text-xs text-text-muted hover:text-accent-rose">x</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// AI COACH - Shows real data
// ============================================
function CoachingPanel() {
  const { protocols } = useAppStore()

  if (protocols.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-8">
        <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2"><span>🤖</span> AI Coach</h3>
        <div className="text-center py-8">
          <span className="text-3xl block mb-3">🤖</span>
          <p className="text-text-muted text-sm mb-4">Generate a protocol to unlock coaching</p>
          <Link href="/generator" className="btn-primary text-xs">Generate Protocol</Link>
        </div>
      </div>
    )
  }

  const active = protocols.find((p: any) => p.status === 'active')

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2"><span>🤖</span> AI Coach</h3>
      <div className="space-y-3">
        {active && (
          <Link href={`/protocol/${active.id}`} className="flex items-start gap-3 p-3 rounded-xl bg-surface-tertiary group">
            <span className="text-xl">📊</span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-sm text-accent-cyan group-hover:underline">{active.goal} - Active</p>
              <p className="text-xs text-text-muted mt-0.5">View details, timeline, and track progress</p>
            </div>
          </Link>
        )}
        {protocols.length >= 2 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-tertiary">
            <span className="text-xl">🔄</span>
            <div>
              <p className="font-display font-semibold text-sm text-accent-violet">{protocols.length} Protocols Generated</p>
              <p className="text-xs text-text-muted mt-0.5">Compare and optimize across different goals</p>
            </div>
          </div>
        )}
        <Link href="/generator" className="flex items-start gap-3 p-3 rounded-xl bg-surface-tertiary group">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-display font-semibold text-sm text-accent-amber group-hover:underline">Generate New Protocol</p>
            <p className="text-xs text-text-muted mt-0.5">Try a different goal for alternative approaches</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ============================================
// PROGRESS TRACKER - Links to full journal
// ============================================
function ProgressTrackerInline() {
  const { protocols } = useAppStore()
  const active = protocols.find((p: any) => p.status === 'active')

  if (!active) {
    return (
      <div className="glass-panel p-5 sm:p-8">
        <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
          <span>📓</span> Progress Journal
        </h3>
        <div className="text-center py-8">
          <span className="text-3xl block mb-3">📓</span>
          <p className="text-text-muted text-sm mb-4">Generate a protocol to start tracking</p>
          <Link href="/generator" className="btn-primary text-xs">Generate Protocol</Link>
        </div>
      </div>
    )
  }

  const totalWeeks = active.protocol?.weeklyTimeline?.length || 12

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-2 flex items-center gap-2">
        <span>📓</span> Progress Journal
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Tracking: <span className="text-accent-cyan">{active.goal}</span>
      </p>

      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2 mb-4">
        {Array.from({ length: totalWeeks }, (_, i) => (
          <div key={i} className="aspect-square rounded-lg flex flex-col items-center justify-center text-center border border-surface-border bg-surface-tertiary transition-all hover:border-accent-cyan/30 cursor-pointer">
            <span className="text-[9px] sm:text-[10px] text-text-muted">W{i + 1}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href={`/protocol/${active.id}/journal`} className="btn-primary text-sm">
          📓 Open Full Journal
        </Link>
        <p className="text-xs text-text-muted mt-2">Log daily mood, side effects, bloodwork, and notes</p>
      </div>
    </div>
  )
}

// ============================================
// MAIN
// ============================================
export default function DashboardPage() {
  const { user, plan } = useAppStore()
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-2">Dashboard</h1>
          <p className="text-text-secondary text-sm sm:text-base">
            {user ? 'Manage your protocols, track progress, and optimize.' : 'Sign up to unlock your command center.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <PlanCard />
            <QuickActions />
          </div>
          <div className="lg:col-span-2">
            <PaywallSection title="Protocol History" description="Generate your first protocol to see it here.">
              <ProtocolTimeline />
            </PaywallSection>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <PaywallSection title="Peptide Synergy Mapping" description="Pro feature - map peptide interactions and compatibility.">
            <PeptideSynergyMap />
          </PaywallSection>
          <PaywallSection title="AI Coaching" description="Pro feature - upgrade to unlock.">
            <CoachingPanel />
          </PaywallSection>
        </div>

        <div className="mb-6">
          <PaywallSection title="Progress Journal" description="Pro feature - track your protocol with daily entries.">
            <ProgressTrackerInline />
          </PaywallSection>
        </div>
      </div>
      <Footer />
    </main>
  )
}
