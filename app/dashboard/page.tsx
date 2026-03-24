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
            <Link href="/pricing" className="btn-primary text-sm">Upgrade to Pro</Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// PLAN CARD — No credits, just plan status
// ============================================
function PlanCard() {
  const { plan } = useAppStore()
  return (
    <div className="glass-panel glow-border p-5 sm:p-8 relative overflow-hidden">
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn('w-3 h-3 rounded-full animate-pulse', plan === 'pro' ? 'bg-accent-cyan' : 'bg-accent-emerald')} />
          <span className="text-sm text-text-secondary font-display">Current Plan</span>
        </div>
        {plan === 'pro' ? (
          <>
            <div className="text-4xl sm:text-5xl font-display font-bold text-gradient mb-2">Pro</div>
            <p className="text-sm text-text-muted mb-5">Unlimited AI protocols, tracking, and analysis</p>
            <Link href="/generator" className="btn-primary text-sm">Generate Protocol</Link>
          </>
        ) : (
          <>
            <div className="text-3xl font-display font-bold text-text-muted mb-2">Free</div>
            <p className="text-sm text-text-muted mb-5">Upgrade for AI protocols and full access</p>
            <Link href="/pricing" className="btn-primary text-sm">Upgrade to Pro — $29/mo</Link>
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
// PROTOCOL HISTORY — REAL DATA, CLICKABLE
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
// STACK BUILDER with save/load
// ============================================
function StackBuilderPro() {
  const { selectedPeptides, stackNodes, removeFromStack, clearStack, addToStack, updateNodePosition,
    savedStacks, addSavedStack, removeSavedStack, loadStackFromSaved, user } = useAppStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [stackName, setStackName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)

  const stackPeptides = selectedPeptides.map(id => getPeptideById(id)).filter(Boolean) as Peptide[]
  const compatibility = selectedPeptides.length >= 2 ? getStackCompatibility(selectedPeptides) : null

  const connections: Array<{ from: string; to: string; type: 'synergy' | 'conflict' }> = []
  for (let i = 0; i < stackPeptides.length; i++) {
    for (let j = i + 1; j < stackPeptides.length; j++) {
      const a = stackPeptides[i], b = stackPeptides[j]
      if (a.synergisticWith.includes(b.id) || b.synergisticWith.includes(a.id)) connections.push({ from: a.id, to: b.id, type: 'synergy' })
      if (a.conflictsWith.includes(b.id) || b.conflictsWith.includes(a.id)) connections.push({ from: a.id, to: b.id, type: 'conflict' })
    }
  }

  const riskColors: Record<string, string> = { low: '#00D68F', moderate: '#FFB800', high: '#FF4D6A', 'very-high': '#FF0040' }
  const getNode = (id: string) => stackNodes.find(n => n.peptideId === id)

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

  const qIds = ['bpc-157', 'ipamorelin', 'cjc-1295-no-dac', 'tb-500', 'semax', 'mk-677'].filter(id => !selectedPeptides.includes(id)).slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="glass-panel p-5 sm:p-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display font-semibold text-base sm:text-lg flex items-center gap-2"><span>🧬</span> Stack Builder</h3>
          <div className="flex gap-2">
            {selectedPeptides.length > 0 && (
              <><button onClick={() => setShowSaveForm(!showSaveForm)} className="text-xs text-accent-cyan px-2 py-1">💾 Save</button>
              <button onClick={clearStack} className="text-xs text-text-muted hover:text-accent-rose px-2 py-1">Clear</button></>
            )}
            <Link href="/peptides" className="text-xs text-accent-cyan px-2 py-1">+ Add</Link>
          </div>
        </div>

        {showSaveForm && (
          <div className="mb-4 p-3 rounded-xl flex gap-2 bg-surface-tertiary">
            <input type="text" value={stackName} onChange={(e) => setStackName(e.target.value)} placeholder="Stack name..." className="input-field !min-h-[36px] !py-1.5 !text-sm flex-1" />
            <button onClick={handleSave} disabled={saving || !stackName.trim()} className="btn-primary !py-1.5 !px-4 text-xs disabled:opacity-50">{saving ? '...' : 'Save'}</button>
          </div>
        )}

        {stackPeptides.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-3xl block mb-3">🧬</span>
            <p className="text-text-muted text-sm mb-4">Add peptides to build your stack</p>
            <div className="flex flex-wrap justify-center gap-2">
              {qIds.map(id => { const p = getPeptideById(id); return p ? (
                <button key={id} onClick={() => addToStack(id)} className="px-3 py-2 rounded-lg text-xs text-text-secondary bg-surface-tertiary hover:text-accent-cyan min-h-[36px]">+ {p.abbreviation}</button>
              ) : null })}
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl border mb-4 overflow-hidden bg-surface border-surface-border">
              <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-[250px] sm:h-[320px] touch-none select-none">
                {connections.map((c, i) => { const f = getNode(c.from), t = getNode(c.to); return f && t ? (
                  <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={c.type === 'synergy' ? '#00D68F' : '#FF4D6A'}
                    strokeWidth={c.type === 'conflict' ? 2 : 1.5} strokeDasharray={c.type === 'conflict' ? '6,4' : 'none'} opacity={0.6} />
                ) : null })}
                {stackNodes.map(n => { const p = getPeptideById(n.peptideId); if (!p) return null; const col = riskColors[p.riskProfile] || '#00E5FF'; return (
                  <g key={n.peptideId} onMouseDown={(e) => handleMouseDown(n.peptideId, e)} onTouchStart={(e) => handleMouseDown(n.peptideId, e)} style={{ cursor: 'grab' }}>
                    <circle cx={n.x} cy={n.y} r={28} fill={col} opacity={0.1} />
                    <circle cx={n.x} cy={n.y} r={22} fill="#12121A" stroke={col} strokeWidth={2} />
                    <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontFamily="monospace" fontWeight="600">{p.abbreviation.substring(0, 6)}</text>
                    <g onClick={(e) => { e.stopPropagation(); removeFromStack(n.peptideId) }} style={{ cursor: 'pointer' }}>
                      <circle cx={n.x + 16} cy={n.y + 16} r={8} fill="#1A1A28" stroke="#2A2A3A" strokeWidth={1} />
                      <text x={n.x + 16} y={n.y + 17} textAnchor="middle" dominantBaseline="middle" fill="#6B7280" fontSize="10">×</text>
                    </g>
                  </g>
                ) })}
              </svg>
            </div>
            {compatibility && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{ l: 'Synergy', v: `${compatibility.score}/10`, c: compatibility.score >= 6 ? 'text-accent-emerald' : 'text-accent-amber' },
                  { l: 'Peptides', v: stackPeptides.length, c: 'text-accent-cyan' },
                  { l: 'Conflicts', v: compatibility.conflicts.length, c: compatibility.conflicts.length > 0 ? 'text-accent-rose' : 'text-accent-emerald' }
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-3 text-center bg-surface-tertiary">
                    <div className="text-xs text-text-muted mb-1">{s.l}</div>
                    <div className={cn('text-lg font-display font-bold', s.c)}>{s.v}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {savedStacks.length > 0 && (
        <div className="glass-panel p-5 sm:p-8">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2"><span>📁</span> Saved Stacks</h3>
          <div className="space-y-3">
            {savedStacks.map(st => (
              <div key={st.id} className="p-3 rounded-xl bg-surface-tertiary flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-sm">{st.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {st.peptide_ids.map(id => { const p = getPeptideById(id); return p ? <span key={id} className="text-[10px] font-mono text-text-muted">{p.abbreviation}</span> : null })}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => loadStackFromSaved(st)} className="text-xs text-accent-cyan">Load</button>
                  <button onClick={() => handleDelete(st.id)} className="text-xs text-text-muted hover:text-accent-rose">×</button>
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
// AI COACH — Shows real data
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
              <p className="font-display font-semibold text-sm text-accent-cyan group-hover:underline">{active.goal} — Active</p>
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
// PROGRESS TRACKER — Links to full journal
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
          <PaywallSection title="Stack Builder" description="Sign up to build stacks." requiresPro={false}>
            <StackBuilderPro />
          </PaywallSection>
          <PaywallSection title="AI Coaching" description="Pro feature — upgrade to unlock.">
            <CoachingPanel />
          </PaywallSection>
        </div>

        <div className="mb-6">
          <PaywallSection title="Progress Journal" description="Pro feature — track your protocol with daily entries.">
            <ProgressTrackerInline />
          </PaywallSection>
        </div>
      </div>
      <Footer />
    </main>
  )
}
