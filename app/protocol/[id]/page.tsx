// app/protocol/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ProtocolData {
  id: string
  goal: string
  gender: string
  input: any
  protocol: any
  status: string
  current_week: number
  credits_used: number
  created_at: string
}

export default function ProtocolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAppStore()
  const [data, setData] = useState<ProtocolData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'risk' | 'alternatives'>('overview')

  useEffect(() => {
    const load = async () => {
      if (!params.id) return
      const supabase = createClient()
      const { data: protocol, error: err } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

      if (err || !protocol) {
        setError('Protocol not found')
      } else {
        setData(protocol)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 rounded-lg max-w-xs mx-auto mb-4 bg-surface-tertiary" />
            <div className="h-4 rounded max-w-sm mx-auto bg-surface-tertiary" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-4xl block mb-4">🔍</span>
          <h1 className="font-display font-bold text-2xl mb-2">Protocol Not Found</h1>
          <p className="text-text-muted text-sm mb-6">{error || 'This protocol does not exist or you don\'t have access.'}</p>
          <Link href="/dashboard" className="btn-primary text-sm">Back to Dashboard</Link>
        </div>
        <Footer />
      </main>
    )
  }

  const p = data.protocol

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 sm:pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <button onClick={() => router.push('/dashboard')} className="text-sm text-text-muted hover:text-accent-cyan mb-2 flex items-center gap-1">
              ← Dashboard
            </button>
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl">{data.goal}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-text-muted">
                {new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-mono',
                data.status === 'active' ? 'text-accent-emerald' :
                data.status === 'completed' ? 'text-accent-cyan' : 'text-accent-amber'
              )} style={{
                backgroundColor: data.status === 'active' ? 'rgba(0,214,143,0.1)' :
                  data.status === 'completed' ? 'rgba(0,229,255,0.1)' : 'rgba(255,184,0,0.1)',
              }}>
                {data.status}
              </span>
              {data.gender && <span className="text-xs text-text-muted capitalize">{data.gender}</span>}
            </div>
          </div>
          <Link href={`/protocol/${params.id}/journal`} className="btn-primary text-sm !py-2">📓 Progress Journal</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 sm:mb-8 overflow-x-auto pb-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'timeline', label: 'Timeline' },
            { key: 'risk', label: 'Risk & Safety' },
            { key: 'alternatives', label: 'Alternatives' },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-display font-medium transition-all whitespace-nowrap min-h-[40px]',
                activeTab === tab.key ? 'text-accent-cyan' : 'text-text-muted hover:text-text-secondary'
              )}
              style={activeTab === tab.key ? { backgroundColor: 'rgba(0,229,255,0.1)' } : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary */}
            {p?.protocolSummary && (
              <div className="glass-panel glow-border p-5 sm:p-8">
                <h2 className="font-display font-bold text-lg sm:text-xl mb-4">Protocol Summary</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-cyan mb-1">Objective</h4>
                    <p className="text-sm text-text-secondary">{p.protocolSummary.objective}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-violet mb-1">Strategic Reasoning</h4>
                    <p className="text-sm text-text-secondary">{p.protocolSummary.strategicReasoning}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Core Stack */}
            {p?.coreStack && (
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
                  <span>🧬</span> Core Stack ({p.coreStack.length} peptides)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.coreStack.map((pep: any, i: number) => (
                    <div key={i} className="glass-panel p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h3 className="font-display font-semibold text-base text-accent-cyan">{pep.name}</h3>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-mono',
                          pep.riskLevel === 'low' ? 'text-accent-emerald' :
                          pep.riskLevel === 'moderate' ? 'text-accent-amber' : 'text-accent-rose'
                        )} style={{
                          backgroundColor: pep.riskLevel === 'low' ? 'rgba(0,214,143,0.1)' :
                            pep.riskLevel === 'moderate' ? 'rgba(255,184,0,0.1)' : 'rgba(255,77,106,0.1)',
                        }}>
                          {pep.riskLevel}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-text-muted">Mechanism:</span><p className="text-text-secondary">{pep.mechanism}</p></div>
                        <div><span className="text-text-muted">Why Selected:</span><p className="text-text-secondary">{pep.whySelected}</p></div>
                        <div><span className="text-text-muted">Synergy:</span><p className="text-text-secondary">{pep.synergyRole}</p></div>
                        <div className="pt-2 border-t border-surface-border">
                          <span className="text-text-muted text-xs">Dosing (Educational): </span>
                          <span className="text-accent-cyan font-mono text-xs">{pep.educationalDosing}</span>
                          <span className="text-text-muted text-xs ml-3">Frequency: </span>
                          <span className="text-text-secondary text-xs">{pep.frequency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synergy Analysis */}
            {p?.synergyAnalysis && (
              <div className="glass-panel p-5 sm:p-8">
                <h2 className="font-display font-bold text-lg sm:text-xl mb-4 flex items-center gap-2"><span>🔗</span> Synergy Analysis</h2>
                <p className="text-sm text-text-secondary mb-4">{p.synergyAnalysis.overview}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-emerald mb-2">Amplifiers</h4>
                    {p.synergyAnalysis.amplifiers?.map((a: string, i: number) => (
                      <p key={i} className="text-xs text-text-secondary mb-1">+ {a}</p>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-amber mb-2">Redundancies</h4>
                    {p.synergyAnalysis.redundancies?.map((r: string, i: number) => (
                      <p key={i} className="text-xs text-text-secondary mb-1">~ {r}</p>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-rose mb-2">Warnings</h4>
                    {p.synergyAnalysis.interactionWarnings?.map((w: string, i: number) => (
                      <p key={i} className="text-xs text-text-secondary mb-1">! {w}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ TIMELINE TAB ============ */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {p?.weeklyTimeline ? (
              <>
                <h2 className="font-display font-bold text-lg sm:text-xl flex items-center gap-2"><span>📅</span> Weekly Timeline</h2>
                <div className="space-y-3">
                  {p.weeklyTimeline.map((week: any, i: number) => (
                    <div key={i} className="glass-panel p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(122,92,255,0.1))' }}>
                        <span className="text-[10px] sm:text-xs text-text-muted">Week</span>
                        <span className="font-display font-bold text-sm sm:text-base text-accent-cyan">{week.week}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display font-semibold text-sm text-accent-violet">{week.phase}</h4>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1">{week.actions}</p>
                        <p className="text-xs text-text-muted mt-1">{week.expectations}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No timeline data available for this protocol</p>
              </div>
            )}

            {/* Adaptation Logic */}
            {p?.adaptationLogic && (
              <div className="glass-panel p-5 sm:p-8">
                <h2 className="font-display font-bold text-lg sm:text-xl mb-4 flex items-center gap-2"><span>🔄</span> Adaptation Logic</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-cyan mb-1">Plateau Response</h4>
                    <p className="text-sm text-text-secondary">{p.adaptationLogic.plateauResponse}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-violet mb-1">Rotation Schedule</h4>
                    <p className="text-sm text-text-secondary">{p.adaptationLogic.rotationSchedule}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-semibold text-accent-amber mb-1">When to Stop</h4>
                    <p className="text-sm text-text-secondary">{p.adaptationLogic.discontinuationCriteria}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ RISK TAB ============ */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            {p?.riskAndTradeoffs ? (
              <>
                <div className="glass-panel p-5 sm:p-8">
                  <h2 className="font-display font-bold text-lg sm:text-xl mb-4 flex items-center gap-2"><span>⚠️</span> Side Effects</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.riskAndTradeoffs.sideEffects?.map((se: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-xs text-accent-rose"
                        style={{ backgroundColor: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.2)' }}>{se}</span>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-5 sm:p-8">
                  <h2 className="font-display font-bold text-lg sm:text-xl mb-4">Suppression Risks</h2>
                  <ul className="space-y-2">
                    {p.riskAndTradeoffs.suppressionRisks?.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent-rose flex-shrink-0">•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-5 sm:p-8">
                  <h2 className="font-display font-bold text-lg sm:text-xl mb-4">Long-Term Considerations</h2>
                  <ul className="space-y-2">
                    {p.riskAndTradeoffs.longTermConsiderations?.map((c: string, i: number) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent-amber flex-shrink-0">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-5 sm:p-8">
                  <h2 className="font-display font-bold text-lg sm:text-xl mb-4">Monitoring Recommendations</h2>
                  <ul className="space-y-2">
                    {p.riskAndTradeoffs.monitoringRecommendations?.map((m: string, i: number) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent-cyan flex-shrink-0">•</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No risk data available</p>
              </div>
            )}
          </div>
        )}

        {/* ============ ALTERNATIVES TAB ============ */}
        {activeTab === 'alternatives' && (
          <div className="space-y-6">
            {p?.alternativeStacks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 sm:p-6" style={{ borderColor: 'rgba(0,214,143,0.2)' }}>
                  <h3 className="font-display font-semibold text-lg text-accent-emerald mb-3">Conservative Option</h3>
                  <p className="text-sm text-text-secondary mb-4">{p.alternativeStacks.conservative?.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.alternativeStacks.conservative?.peptides?.map((name: string, i: number) => (
                      <span key={i} className="px-2 py-1 rounded text-xs text-accent-emerald font-mono"
                        style={{ backgroundColor: 'rgba(0,214,143,0.1)' }}>{name}</span>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted italic">{p.alternativeStacks.conservative?.tradeoff}</p>
                </div>

                <div className="glass-panel p-5 sm:p-6" style={{ borderColor: 'rgba(255,77,106,0.2)' }}>
                  <h3 className="font-display font-semibold text-lg text-accent-rose mb-3">Aggressive Option</h3>
                  <p className="text-sm text-text-secondary mb-4">{p.alternativeStacks.aggressive?.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.alternativeStacks.aggressive?.peptides?.map((name: string, i: number) => (
                      <span key={i} className="px-2 py-1 rounded text-xs text-accent-rose font-mono"
                        style={{ backgroundColor: 'rgba(255,77,106,0.1)' }}>{name}</span>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted italic">{p.alternativeStacks.aggressive?.tradeoff}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted">No alternative stacks available</p>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="glass-panel p-4 sm:p-6 mt-8" style={{ borderColor: 'rgba(255,184,0,0.2)' }}>
          <p className="text-xs text-text-muted text-center leading-relaxed">
            ⚠️ <strong>DISCLAIMER:</strong> This protocol is for educational and research purposes only.
            All dosing is non-prescriptive. Not medical advice. Consult a qualified healthcare professional.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
