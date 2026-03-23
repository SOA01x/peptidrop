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
function PaywallSection({ children, title, description, requiresPro = true }: {
  children: React.ReactNode; title: string; description: string; requiresPro?: boolean
}) {
  const { user, plan } = useAppStore()
  const showPaywall = requiresPro ? (!user || plan === 'free') : !user

  if (!showPaywall) return <>{children}</>

  return (
    <div className="relative">
      <div className="blur-md pointer-events-none select-none opacity-40">{children}</div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl"
        style={{ backgroundColor: 'rgba(10,10,15,0.5)' }}>
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
// PLAN CARD
// ============================================
function PlanCard() {
  const { plan, credits } = useAppStore()
  return (
    <div className="glass-panel glow-border p-5 sm:p-8 relative overflow-hidden">
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('w-3 h-3 rounded-full animate-pulse', plan === 'pro' ? 'bg-accent-cyan' : 'bg-accent-emerald')} />
          <span className="text-sm text-text-secondary font-display">
            {plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
          </span>
        </div>
        {plan === 'free' ? (
          <>
            <div className="text-3xl sm:text-4xl font-display font-bold text-text-muted mb-3">Explorer</div>
            <p className="text-sm text-text-muted mb-5">Upgrade to unlock AI protocols and tracking</p>
            <Link href="/pricing" className="btn-primary text-sm">Upgrade to Pro — $29/mo</Link>
          </>
        ) : (
          <>
            <div className="text-4xl sm:text-5xl font-display font-bold text-gradient mb-1">{credits}</div>
            <p className="text-sm text-text-muted mb-5">AI analyses remaining</p>
            <Link href="/generator" className="btn-primary text-sm">Generate Protocol</Link>
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
        <Link href="/generator" className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-surface-border transition-all group"
          style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
          <span className="text-xl sm:text-2xl">⚡</span>
          <div>
            <p className="font-display font-semibold text-sm group-hover:text-accent-cyan transition-colors">Generate Protocol</p>
            <p className="text-xs text-text-muted">AI-powered stack generation</p>
          </div>
        </Link>
        <Link href="/peptides" className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-surface-border transition-all group"
          style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
          <span className="text-xl sm:text-2xl">🔍</span>
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
// PROTOCOL HISTORY — REAL DATA ONLY
// ============================================
function ProtocolTimeline() {
  const { protocols } = useAppStore()

  if (protocols.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-8">
        <h3 className="font-display font-semibold text-base sm:text-lg mb-6 flex items-center gap-2">
          <span>📋</span> Protocol History
        </h3>
        <div className="text-center py-12 sm:py-16">
          <span className="text-4xl block mb-4">📋</span>
          <h4 className="font-display font-semibold text-base mb-2">No protocols yet</h4>
          <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
            Generate your first AI protocol to see it here with progress tracking.
          </p>
          <Link href="/generator" className="btn-primary text-sm">Generate Your First Protocol</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-6 flex items-center gap-2">
        <span>📋</span> Protocol History
        <span className="text-xs font-mono text-text-muted ml-auto">{protocols.length} protocol{protocols.length !== 1 ? 's' : ''}</span>
      </h3>

      <div className="relative">
        <div className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #00E5FF33, #7A5CFF22, transparent)' }} />

        <div className="space-y-4 sm:space-y-6">
          {protocols.map((p: any) => (
            <div key={p.id} className="relative pl-10 sm:pl-14">
              <div className={cn(
                'absolute left-2.5 sm:left-3.5 top-4 w-3 h-3 rounded-full',
                p.status === 'active' ? 'bg-accent-emerald' :
                p.status === 'completed' ? 'bg-accent-cyan' : 'bg-accent-amber'
              )} style={{ border: '2px solid var(--color-surface)' }} />

              <Link href={`/protocol/${p.id}`} className="glass-panel-light p-4 sm:p-5 card-hover block">
                <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-sm sm:text-base">{p.goal}</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-mono',
                    p.status === 'active' ? 'text-accent-emerald' :
                    p.status === 'completed' ? 'text-accent-cyan' : 'text-accent-amber'
                  )} style={{
                    backgroundColor: p.status === 'active' ? 'rgba(0,214,143,0.1)' :
                      p.status === 'completed' ? 'rgba(0,229,255,0.1)' : 'rgba(255,184,0,0.1)',
                    border: `1px solid ${p.status === 'active' ? 'rgba(0,214,143,0.2)' :
                      p.status === 'completed' ? 'rgba(0,229,255,0.2)' : 'rgba(255,184,0,0.2)'}`
                  }}>
                    {p.status || 'active'}
                  </span>
                </div>

                {/* Stack pills from real protocol data */}
                {p.protocol?.coreStack && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.protocol.coreStack.slice(0, 5).map((s: any, j: number) => (
                      <span key={j} className="px-2 py-0.5 rounded text-xs text-text-secondary font-mono"
                        style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// STACK BUILDER — REAL, NO FAKE DATA
// ============================================
function StackBuilderPro() {
  const { selectedPeptides, stackNodes, removeFromStack, clearStack, addToStack, updateNodePosition } = useAppStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const stackPeptides = selectedPeptides.map(id => getPeptideById(id)).filter(Boolean) as Peptide[]
  const compatibility = selectedPeptides.length >= 2 ? getStackCompatibility(selectedPeptides) : null

  const connections: Array<{ from: string; to: string; type: 'synergy' | 'conflict' }> = []
  for (let i = 0; i < stackPeptides.length; i++) {
    for (let j = i + 1; j < stackPeptides.length; j++) {
      const a = stackPeptides[i], b = stackPeptides[j]
      if (a.synergisticWith.includes(b.id) || b.synergisticWith.includes(a.id))
        connections.push({ from: a.id, to: b.id, type: 'synergy' })
      if (a.conflictsWith.includes(b.id) || b.conflictsWith.includes(a.id))
        connections.push({ from: a.id, to: b.id, type: 'conflict' })
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

  const popularIds = ['bpc-157', 'ipamorelin', 'cjc-1295-no-dac', 'tb-500', 'semax', 'mk-677']
  const quickAddOptions = popularIds.filter(id => !selectedPeptides.includes(id)).slice(0, 4)

  return (
    <div className="glass-panel p-5 sm:p-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-display font-semibold text-base sm:text-lg flex items-center gap-2">
          <span>🧬</span> Stack Builder
        </h3>
        <div className="flex gap-2">
          {selectedPeptides.length > 0 && (
            <button onClick={clearStack} className="text-xs text-text-muted hover:text-accent-rose transition-colors px-2 py-1">Clear All</button>
          )}
          <Link href="/peptides" className="text-xs text-accent-cyan hover:underline px-2 py-1">+ Add from Explorer</Link>
        </div>
      </div>

      {stackPeptides.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <span className="text-3xl sm:text-4xl block mb-4">🧬</span>
          <h4 className="font-display font-semibold text-sm mb-2">Start building your stack</h4>
          <p className="text-text-muted text-xs mb-4">Add peptides to see synergy scores and interactions</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickAddOptions.map(id => {
              const p = getPeptideById(id)
              if (!p) return null
              return (
                <button key={id} onClick={() => addToStack(id)}
                  className="px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-accent-cyan transition-all min-h-[36px]"
                  style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
                  + {p.abbreviation}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <>
          {/* SVG Node Graph */}
          <div className="rounded-xl border mb-4 overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-border)' }}>
            <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-[250px] sm:h-[320px] touch-none select-none">
              {connections.map((conn, i) => {
                const fromNode = getNode(conn.from)
                const toNode = getNode(conn.to)
                if (!fromNode || !toNode) return null
                return (
                  <line key={i} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
                    stroke={conn.type === 'synergy' ? '#00D68F' : '#FF4D6A'}
                    strokeWidth={conn.type === 'conflict' ? 2 : 1.5}
                    strokeDasharray={conn.type === 'conflict' ? '6,4' : 'none'} opacity={0.6} />
                )
              })}
              {stackNodes.map(node => {
                const p = getPeptideById(node.peptideId)
                if (!p) return null
                const color = riskColors[p.riskProfile] || '#00E5FF'
                return (
                  <g key={node.peptideId} onMouseDown={(e) => handleMouseDown(node.peptideId, e)}
                    onTouchStart={(e) => handleMouseDown(node.peptideId, e)} style={{ cursor: 'grab' }}>
                    <circle cx={node.x} cy={node.y} r={28} fill={color} opacity={0.1} />
                    <circle cx={node.x} cy={node.y} r={22} fill="#12121A" stroke={color} strokeWidth={2} />
                    <text x={node.x} y={node.y - 1} textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize="9" fontFamily="monospace" fontWeight="600">
                      {p.abbreviation.substring(0, 6)}
                    </text>
                    <circle cx={node.x + 16} cy={node.y - 16} r={4} fill={color} />
                    <g onClick={(e) => { e.stopPropagation(); removeFromStack(node.peptideId) }} style={{ cursor: 'pointer' }}>
                      <circle cx={node.x + 16} cy={node.y + 16} r={8} fill="#1A1A28" stroke="#2A2A3A" strokeWidth={1} />
                      <text x={node.x + 16} y={node.y + 17} textAnchor="middle" dominantBaseline="middle" fill="#6B7280" fontSize="10">×</text>
                    </g>
                  </g>
                )
              })}
              <g transform="translate(10, 370)">
                <circle cx={5} cy={0} r={4} fill="#00D68F" /><text x={14} y={4} fill="#6B7280" fontSize="8">Synergy</text>
                <circle cx={80} cy={0} r={4} fill="#FF4D6A" /><text x={89} y={4} fill="#6B7280" fontSize="8">Conflict</text>
              </g>
            </svg>
          </div>

          {compatibility && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Synergy', value: `${compatibility.score}/10`, color: compatibility.score >= 6 ? 'text-accent-emerald' : compatibility.score >= 3 ? 'text-accent-amber' : 'text-accent-rose' },
                { label: 'Peptides', value: stackPeptides.length, color: 'text-accent-cyan' },
                { label: 'Conflicts', value: compatibility.conflicts.length, color: compatibility.conflicts.length > 0 ? 'text-accent-rose' : 'text-accent-emerald' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
                  <div className="text-xs text-text-muted mb-1">{s.label}</div>
                  <div className={cn('text-lg font-display font-bold', s.color)}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {quickAddOptions.map(id => {
              const p = getPeptideById(id)
              if (!p) return null
              return (
                <button key={id} onClick={() => addToStack(id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-text-muted hover:text-accent-cyan transition-all min-h-[32px]"
                  style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
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
// AI COACH — EMPTY STATE FOR NO PROTOCOLS
// ============================================
function CoachingPanel() {
  const { protocols } = useAppStore()

  if (protocols.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-8">
        <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
          <span>🤖</span> AI Coach
        </h3>
        <div className="text-center py-8">
          <span className="text-3xl block mb-3">🤖</span>
          <p className="text-text-muted text-sm">Generate a protocol to unlock AI coaching suggestions</p>
        </div>
      </div>
    )
  }

  // Real suggestions based on actual protocol data
  const activeProtocol = protocols.find((p: any) => p.status === 'active')
  const suggestions = []

  if (activeProtocol) {
    suggestions.push({
      icon: '📊',
      title: `${activeProtocol.goal} — Active`,
      desc: `Started ${new Date(activeProtocol.created_at).toLocaleDateString()}. Track your progress and log weekly updates.`,
      accent: 'text-accent-cyan',
    })
  }

  if (protocols.length >= 2) {
    suggestions.push({
      icon: '🔄',
      title: 'Compare Protocols',
      desc: `You have ${protocols.length} protocols. Review past stacks to optimize your next cycle.`,
      accent: 'text-accent-violet',
    })
  }

  suggestions.push({
    icon: '💡',
    title: 'Explore New Goals',
    desc: 'Try generating a protocol for a different goal to see alternative stack approaches.',
    accent: 'text-accent-amber',
  })

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
        <span>🤖</span> AI Coach
      </h3>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface-tertiary)' }}>
            <span className="text-xl flex-shrink-0">{s.icon}</span>
            <div className="min-w-0 flex-1">
              <p className={cn('font-display font-semibold text-sm', s.accent)}>{s.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// PROGRESS TRACKER — EMPTY FOR NO PROTOCOLS
// ============================================
function ProgressTracker() {
  const { protocols } = useAppStore()

  if (protocols.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-8">
        <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
          <span>📈</span> Progress Tracker
        </h3>
        <div className="text-center py-8">
          <span className="text-3xl block mb-3">📈</span>
          <p className="text-text-muted text-sm">No active protocols to track yet</p>
        </div>
      </div>
    )
  }

  // Show empty week grid for 12 weeks — no fake data
  const weeks = Array.from({ length: 12 }, (_, i) => ({ week: i + 1 }))

  return (
    <div className="glass-panel p-5 sm:p-8">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
        <span>📈</span> Progress Tracker
      </h3>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2">
        {weeks.map(w => (
          <div key={w.week} className="aspect-square rounded-lg flex flex-col items-center justify-center text-center border transition-all"
            style={{ backgroundColor: 'var(--color-surface-tertiary)', borderColor: 'var(--color-surface-border)' }}>
            <span className="text-[9px] sm:text-[10px] text-text-muted">W{w.week}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-muted mt-3 text-center">Log your weekly progress as you follow your protocol</p>
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
        <div className="mb-8 sm:mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-2">Dashboard</h1>
          <p className="text-text-secondary text-sm sm:text-base">
            {user ? 'Manage your protocols, track progress, and optimize.' : 'Sign up to unlock your personal command center.'}
          </p>
        </div>

        {/* Top: Plan + Quick Actions + Protocol History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <PlanCard />
            <QuickActions />
          </div>

          <div className="lg:col-span-2">
            <PaywallSection title="Protocol History" description="Generate your first AI protocol to see it tracked here.">
              <ProtocolTimeline />
            </PaywallSection>
          </div>
        </div>

        {/* Stack Builder + AI Coach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <PaywallSection title="Stack Builder" description="Sign up to build and analyze peptide stacks." requiresPro={false}>
            <StackBuilderPro />
          </PaywallSection>

          <PaywallSection title="AI Coaching" description="Generate a protocol to unlock AI coaching.">
            <CoachingPanel />
          </PaywallSection>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6 sm:mb-8">
          <PaywallSection title="Progress Tracking" description="Track weekly progress with your active protocol.">
            <ProgressTracker />
          </PaywallSection>
        </div>
      </div>

      <Footer />
    </main>
  )
}
