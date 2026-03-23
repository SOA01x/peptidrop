// app/dashboard/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { peptides, getPeptideById, getStackCompatibility, peptideCategories, type Peptide } from '@/data/peptides'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ============================================
// PAYWALL BLUR WRAPPER
// ============================================
function PaywallSection({ children, title, description, requiresPro = true }: { children: React.ReactNode; title: string; description: string; requiresPro?: boolean }) {
  const { user, plan } = useAppStore()
  // requiresPro=true: blocks non-logged-in and free users (AI features)
  // requiresPro=false: only blocks non-logged-in users (basic features like stack builder)
  const showPaywall = requiresPro ? (!user || plan === 'free') : !user

  if (!showPaywall) return <>{children}</>

  return (
    <div className="relative">
      <div className="blur-md pointer-events-none select-none opacity-60">{children}</div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/40 backdrop-blur-sm rounded-card">
        <div className="text-center px-6 max-w-md">
          <span className="text-3xl sm:text-4xl block mb-3">🔒</span>
          <h3 className="font-display font-bold text-lg sm:text-xl mb-2">{title}</h3>
          <p className="text-text-muted text-sm mb-5">{description}</p>
          {!user ? (
            <Link href="/signup" className="btn-primary text-sm">Sign Up Free</Link>
          ) : (
            <Link href="/pricing" className="btn-primary text-sm">Upgrade to Pro</Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// CREDITS & PLAN CARD
// ============================================
function PlanCard() {
  const { plan, credits, user } = useAppStore()
  return (
    <div className="glass-panel glow-border p-5 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-accent-cyan/5 rounded-full blur-[60px]" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('w-3 h-3 rounded-full animate-pulse', plan === 'pro' ? 'bg-accent-cyan' : 'bg-accent-emerald')} />
          <span className="text-sm text-text-secondary font-display">
            {plan === 'pro' ? 'Pro Plan' : plan === 'premium' ? 'Premium' : 'Free Plan'}
          </span>
        </div>
        {plan === 'free' ? (
          <>
            <div className="text-3xl sm:text-4xl font-display font-bold text-text-muted mb-3">Explorer</div>
            <p className="text-sm text-text-muted mb-5">Upgrade to unlock AI protocols, tracking, and more</p>
            <Link href="/pricing" className="btn-primary text-sm !py-2.5">Upgrade to Pro — $29/mo</Link>
          </>
        ) : (
          <>
            <div className="text-4xl sm:text-5xl font-display font-bold text-gradient mb-1">{credits}</div>
            <p className="text-sm text-text-muted mb-5">AI analyses remaining this period</p>
            <div className="flex gap-3">
              <Link href="/generator" className="btn-primary text-sm !py-2.5">Generate Protocol</Link>
            </div>
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
        <Link href="/generator" className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface-tertiary rounded-xl active:bg-accent-cyan/5 border border-transparent transition-all group">
          <span className="text-xl sm:text-2xl">⚡</span>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Generate Protocol</p>
            <p className="text-xs text-text-muted">AI-powered stack generation</p>
          </div>
        </Link>
        <Link href="/peptides" className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface-tertiary rounded-xl active:bg-accent-violet/5 border border-transparent transition-all group">
          <span className="text-xl sm:text-2xl">🔍</span>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm group-hover:text-accent-violet transition-colors">Explore Peptides</p>
            <p className="text-xs text-text-muted">Browse 345+ compounds</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ============================================
// PROTOCOL HISTORY - TIMELINE CARDS
// ============================================
function ProtocolTimeline() {
  const { protocols } = useAppStore()

  // Demo data for paywall preview
  const demoProtocols = [
    { id: '1', goal: 'Fat Loss Optimization', created_at: '2026-03-20', status: 'active', currentWeek: 4, protocol: { coreStack: [{ name: 'Tesamorelin' }, { name: 'AOD-9604' }, { name: 'Ipamorelin' }] } },
    { id: '2', goal: 'Cognitive Enhancement', created_at: '2026-02-15', status: 'completed', currentWeek: 12, protocol: { coreStack: [{ name: 'Semax' }, { name: 'Selank' }, { name: 'BPC-157' }] } },
    { id: '3', goal: 'Recovery Protocol', created_at: '2026-01-08', status: 'paused', currentWeek: 6, protocol: { coreStack: [{ name: 'BPC-157' }, { name: 'TB-500' }] } },
  ]

  const displayProtocols = protocols.length > 0 ? protocols : demoProtocols

  const statusColors: Record<string, string> = {
    active: 'bg-accent-emerald text-accent-emerald',
    completed: 'bg-accent-cyan text-accent-cyan',
    paused: 'bg-accent-amber text-accent-amber',
  }

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-6 flex items-center gap-2">
        <span>📋</span> Protocol History
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/30 via-accent-violet/20 to-transparent" />

        <div className="space-y-4 sm:space-y-6">
          {displayProtocols.map((p: any, i: number) => (
            <div key={p.id} className="relative pl-10 sm:pl-14">
              {/* Timeline dot */}
              <div className={cn(
                'absolute left-2.5 sm:left-3.5 top-4 w-3 h-3 rounded-full border-2 border-surface',
                p.status === 'active' ? 'bg-accent-emerald shadow-[0_0_8px_rgba(0,214,143,0.5)]' :
                p.status === 'completed' ? 'bg-accent-cyan' : 'bg-accent-amber'
              )} />

              <div className="glass-panel-light p-4 sm:p-5 card-hover">
                <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-sm sm:text-base">{p.goal}</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-mono border',
                      p.status === 'active' ? 'bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald' :
                      p.status === 'completed' ? 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan' :
                      'bg-accent-amber/10 border-accent-amber/20 text-accent-amber'
                    )}>
                      {p.status || 'active'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {p.currentWeek && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-text-muted mb-1">
                      <span>Week {p.currentWeek}</span>
                      <span>12 weeks</span>
                    </div>
                    <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full transition-all"
                        style={{ width: `${Math.min(100, (p.currentWeek / 12) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Stack pills */}
                {p.protocol?.coreStack && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.protocol.coreStack.slice(0, 4).map((s: any, j: number) => (
                      <span key={j} className="px-2 py-0.5 bg-surface-tertiary rounded text-xs text-text-secondary font-mono">
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// STACK BUILDER PRO - SVG NODE GRAPH
// ============================================
function StackBuilderPro() {
  const { selectedPeptides, stackNodes, removeFromStack, clearStack, addToStack, updateNodePosition } = useAppStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const stackPeptides = selectedPeptides.map(id => getPeptideById(id)).filter(Boolean) as Peptide[]
  const compatibility = selectedPeptides.length >= 2 ? getStackCompatibility(selectedPeptides) : null

  // Generate connections
  const connections: Array<{ from: string; to: string; type: 'synergy' | 'conflict' | 'similar'; strength: number }> = []
  for (let i = 0; i < stackPeptides.length; i++) {
    for (let j = i + 1; j < stackPeptides.length; j++) {
      const a = stackPeptides[i], b = stackPeptides[j]
      if (a.synergisticWith.includes(b.id) || b.synergisticWith.includes(a.id)) {
        connections.push({ from: a.id, to: b.id, type: 'synergy', strength: 3 })
      }
      if (a.conflictsWith.includes(b.id) || b.conflictsWith.includes(a.id)) {
        connections.push({ from: a.id, to: b.id, type: 'conflict', strength: 3 })
      }
    }
  }

  const riskColors: Record<string, string> = {
    low: '#00D68F', moderate: '#FFB800', high: '#FF4D6A', 'very-high': '#FF0040',
  }

  const getNode = (id: string) => stackNodes.find(n => n.peptideId === id)

  const handleMouseDown = (peptideId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const node = getNode(peptideId)
    if (!node || !svgRef.current) return

    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    pt.x = clientX; pt.y = clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

    setDragging(peptideId)
    setDragOffset({ x: svgP.x - node.x, y: svgP.y - node.y })
  }

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!svgRef.current) return
      const svg = svgRef.current
      const pt = svg.createSVGPoint()
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
      pt.x = clientX; pt.y = clientY
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
      updateNodePosition(dragging, svgP.x - dragOffset.x, svgP.y - dragOffset.y)
    }
    const handleUp = () => setDragging(null)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [dragging, dragOffset, updateNodePosition])

  // Quick add from popular peptides
  const popularIds = ['bpc-157', 'ipamorelin', 'cjc-1295-no-dac', 'tb-500', 'semax', 'mk-677']
  const quickAddOptions = popularIds.filter(id => !selectedPeptides.includes(id)).slice(0, 4)

  return (
    <div className="glass-panel p-5 sm:p-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-display font-semibold text-base sm:text-lg flex items-center gap-2">
          <span>🧬</span> Stack Builder Pro
        </h3>
        <div className="flex gap-2">
          {selectedPeptides.length > 0 && (
            <button onClick={clearStack} className="text-xs text-text-muted hover:text-accent-rose transition-colors px-2 py-1">Clear</button>
          )}
          <Link href="/peptides" className="text-xs text-accent-cyan hover:underline px-2 py-1">+ Add from Explorer</Link>
        </div>
      </div>

      {stackPeptides.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <span className="text-3xl sm:text-4xl block mb-4">🧬</span>
          <p className="text-text-muted text-sm mb-4">Drag & drop peptides to build your stack</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickAddOptions.map(id => {
              const p = getPeptideById(id)
              if (!p) return null
              return (
                <button key={id} onClick={() => addToStack(id)}
                  className="px-3 py-2 bg-surface-tertiary rounded-lg text-xs text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/5 transition-all min-h-[36px]">
                  + {p.abbreviation}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <>
          {/* SVG Node Graph */}
          <div className="bg-surface rounded-xl border border-surface-border/30 mb-4 overflow-hidden">
            <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-[250px] sm:h-[320px] touch-none select-none">
              {/* Connection lines */}
              {connections.map((conn, i) => {
                const fromNode = getNode(conn.from)
                const toNode = getNode(conn.to)
                if (!fromNode || !toNode) return null
                return (
                  <line key={i}
                    x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
                    stroke={conn.type === 'synergy' ? '#00D68F' : conn.type === 'conflict' ? '#FF4D6A' : '#7A5CFF'}
                    strokeWidth={conn.type === 'conflict' ? 2 : 1.5}
                    strokeDasharray={conn.type === 'conflict' ? '6,4' : 'none'}
                    opacity={0.6}
                  />
                )
              })}

              {/* Nodes */}
              {stackNodes.map(node => {
                const p = getPeptideById(node.peptideId)
                if (!p) return null
                const color = riskColors[p.riskProfile] || '#00E5FF'
                return (
                  <g key={node.peptideId}
                    onMouseDown={(e) => handleMouseDown(node.peptideId, e)}
                    onTouchStart={(e) => handleMouseDown(node.peptideId, e)}
                    style={{ cursor: 'grab' }}
                  >
                    {/* Glow */}
                    <circle cx={node.x} cy={node.y} r={28} fill={color} opacity={0.1} />
                    {/* Ring */}
                    <circle cx={node.x} cy={node.y} r={22} fill="#12121A" stroke={color} strokeWidth={2} />
                    {/* Label */}
                    <text x={node.x} y={node.y - 1} textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="600">
                      {p.abbreviation.substring(0, 6)}
                    </text>
                    {/* Risk indicator dot */}
                    <circle cx={node.x + 16} cy={node.y - 16} r={4} fill={color} />
                    {/* Remove button */}
                    <g onClick={(e) => { e.stopPropagation(); removeFromStack(node.peptideId) }}
                      style={{ cursor: 'pointer' }}>
                      <circle cx={node.x + 16} cy={node.y + 16} r={8} fill="#1A1A28" stroke="#2A2A3A" strokeWidth={1} />
                      <text x={node.x + 16} y={node.y + 17} textAnchor="middle" dominantBaseline="middle"
                        fill="#6B7280" fontSize="10">×</text>
                    </g>
                  </g>
                )
              })}

              {/* Legend */}
              <g transform="translate(10, 370)">
                <circle cx={5} cy={0} r={4} fill="#00D68F" /><text x={14} y={4} fill="#6B7280" fontSize="8">Synergy</text>
                <circle cx={80} cy={0} r={4} fill="#FF4D6A" /><text x={89} y={4} fill="#6B7280" fontSize="8">Conflict</text>
              </g>
            </svg>
          </div>

          {/* Scores */}
          {compatibility && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-surface-tertiary rounded-xl p-3 text-center">
                <div className="text-xs text-text-muted mb-1">Synergy</div>
                <div className={cn('text-lg font-display font-bold',
                  compatibility.score >= 6 ? 'text-accent-emerald' : compatibility.score >= 3 ? 'text-accent-amber' : 'text-accent-rose'
                )}>{compatibility.score}/10</div>
              </div>
              <div className="bg-surface-tertiary rounded-xl p-3 text-center">
                <div className="text-xs text-text-muted mb-1">Peptides</div>
                <div className="text-lg font-display font-bold text-accent-cyan">{stackPeptides.length}</div>
              </div>
              <div className="bg-surface-tertiary rounded-xl p-3 text-center">
                <div className="text-xs text-text-muted mb-1">Conflicts</div>
                <div className={cn('text-lg font-display font-bold',
                  compatibility.conflicts.length > 0 ? 'text-accent-rose' : 'text-accent-emerald'
                )}>{compatibility.conflicts.length}</div>
              </div>
            </div>
          )}

          {/* Quick add */}
          <div className="flex flex-wrap gap-2">
            {quickAddOptions.map(id => {
              const p = getPeptideById(id)
              if (!p) return null
              return (
                <button key={id} onClick={() => addToStack(id)}
                  className="px-2.5 py-1.5 bg-surface-tertiary rounded-lg text-xs text-text-muted hover:text-accent-cyan transition-all min-h-[32px]">
                  + {p.abbreviation}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// AI COACHING PANEL
// ============================================
function CoachingPanel() {
  const suggestions = [
    { icon: '📊', title: 'Weekly Update Available', desc: 'Your Fat Loss protocol is in week 4. Review AI adjustments.', action: 'Review', accent: 'text-accent-cyan' },
    { icon: '🔄', title: 'Stack Suggestion', desc: 'Based on your progress, consider adding Semax for cognitive support.', action: 'Explore', accent: 'text-accent-violet' },
    { icon: '⚠️', title: 'Risk Check', desc: 'Your current stack includes compounds that need periodic bloodwork.', action: 'Details', accent: 'text-accent-amber' },
  ]

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
        <span>🤖</span> AI Coach
      </h3>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-3 sm:p-4 bg-surface-tertiary rounded-xl">
            <span className="text-xl flex-shrink-0">{s.icon}</span>
            <div className="min-w-0 flex-1">
              <p className={cn('font-display font-semibold text-sm', s.accent)}>{s.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
            </div>
            <button className="text-xs text-accent-cyan hover:underline flex-shrink-0 min-h-[32px] flex items-center">{s.action}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// PROGRESS TRACKER
// ============================================
function ProgressTracker() {
  const weeks = Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    completed: i < 4,
    current: i === 4,
    rating: i < 4 ? [7, 6, 8, 7][i] : null,
  }))

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
        <span>📈</span> Progress Tracker
      </h3>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2">
        {weeks.map(w => (
          <div key={w.week} className={cn(
            'aspect-square rounded-lg flex flex-col items-center justify-center text-center border transition-all',
            w.completed ? 'bg-accent-emerald/10 border-accent-emerald/30' :
            w.current ? 'bg-accent-cyan/10 border-accent-cyan/30 animate-pulse' :
            'bg-surface-tertiary border-surface-border/30'
          )}>
            <span className="text-[9px] sm:text-[10px] text-text-muted">W{w.week}</span>
            {w.rating && <span className="text-[10px] sm:text-xs font-mono text-accent-emerald">{w.rating}</span>}
            {w.current && <span className="text-[9px] text-accent-cyan">now</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD
// ============================================
export default function DashboardPage() {
  const { user, plan } = useAppStore()

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-2">Dashboard</h1>
          <p className="text-text-secondary text-sm sm:text-base">
            {user ? 'Manage your protocols, track progress, and optimize.' : 'Sign up to unlock your personal command center.'}
          </p>
        </div>

        {/* Top row: Plan + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <PlanCard />
            <QuickActions />
          </div>

          {/* Protocol History — timeline style */}
          <div className="lg:col-span-2">
            <PaywallSection title="Protocol History" description="Track your active, completed, and paused protocols with progress timelines.">
              <ProtocolTimeline />
            </PaywallSection>
          </div>
        </div>

        {/* Stack Builder Pro + AI Coach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <PaywallSection title="Stack Builder" description="Sign up to build and analyze peptide stacks." requiresPro={false}>
            <StackBuilderPro />
          </PaywallSection>

          <PaywallSection title="AI Coaching" description="Weekly updates, progress-based suggestions, and adaptive optimization.">
            <CoachingPanel />
          </PaywallSection>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6 sm:mb-8">
          <PaywallSection title="Progress Tracking" description="Track weekly progress with ratings and AI-powered adjustments.">
            <ProgressTracker />
          </PaywallSection>
        </div>
      </div>

      <Footer />
    </main>
  )
}
