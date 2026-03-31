// app/generator/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { GOALS, GENDERS, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import type { GeneratedProtocol } from '@/lib/ai-engine'
import Link from 'next/link'

const GENERATION_STEPS = [
  'Analyzing user profile...',
  'Scanning peptide database...',
  'Mapping receptor interactions...',
  'Calculating synergy scores...',
  'Evaluating risk profiles...',
  'Building timeline progression...',
  'Generating protocol report...',
]

function GoalSelector({ selected, onSelect }: { selected: string; onSelect: (g: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {GOALS.map((goal) => (
        <button key={goal.id} onClick={() => onSelect(goal.id)}
          className={cn(
            'p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left group min-h-[44px]',
            selected === goal.id
              ? 'border-accent-cyan/50 bg-accent-cyan/10 shadow-glow'
              : 'border-surface-border bg-surface-secondary active:bg-surface-tertiary'
          )}>
          <span className="text-xl sm:text-2xl block mb-1 sm:mb-2">{goal.icon}</span>
          <span className={cn('font-display font-semibold text-xs sm:text-sm',
            selected === goal.id ? 'text-accent-cyan' : 'text-text-primary'
          )}>{goal.label}</span>
        </button>
      ))}
    </div>
  )
}

function GenderSelector({ selected, onSelect }: { selected: string; onSelect: (g: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {GENDERS.map((g) => (
        <button key={g.id} onClick={() => onSelect(g.id)}
          className={cn(
            'py-3 sm:py-4 px-3 rounded-xl border text-center transition-all duration-300 min-h-[44px]',
            selected === g.id
              ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
              : 'border-surface-border bg-surface-secondary text-text-muted active:bg-surface-tertiary'
          )}>
          <span className="text-xl block mb-1">{g.icon}</span>
          <span className="font-display font-medium text-xs sm:text-sm">{g.label}</span>
        </button>
      ))}
    </div>
  )
}

function SliderInput({ label, value, onChange, min, max, step = 1, labels }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step?: number; labels?: string[]
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-display font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-mono text-accent-cyan">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface-tertiary rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-pointer" />
      {labels && (
        <div className="flex justify-between mt-1">
          {labels.map((l, i) => <span key={i} className="text-xs text-text-muted">{l}</span>)}
        </div>
      )}
    </div>
  )
}

function GeneratingOverlay({ step }: { step: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur-xl">
      <div className="text-center max-w-md px-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-accent-cyan/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-3 border-2 border-accent-violet/20 rounded-full" />
          <div className="absolute inset-3 border-2 border-accent-violet border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl">🧬</span></div>
        </div>
        <h3 className="font-display font-bold text-xl mb-3 text-gradient">Generating Protocol</h3>
        <p className="text-text-secondary text-sm mb-6">{step}</p>
        <div className="w-48 h-1 bg-surface-tertiary rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet shimmer-bg rounded-full" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

function ProtocolReport({ protocol }: { protocol: GeneratedProtocol }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {protocol.protocolSummary && (
        <div className="glass-panel glow-border p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📋</span>
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl">Protocol Summary</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-display font-semibold text-accent-cyan mb-1">Objective</h4>
              <p className="text-sm sm:text-base text-text-secondary">{protocol.protocolSummary.objective}</p>
            </div>
            <div>
              <h4 className="text-sm font-display font-semibold text-accent-violet mb-1">Strategic Reasoning</h4>
              <p className="text-sm sm:text-base text-text-secondary">{protocol.protocolSummary.strategicReasoning}</p>
            </div>
          </div>
        </div>
      )}

      {protocol.coreStack && (
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
            <span>🧬</span> Core Stack ({protocol.coreStack.length} peptides)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {protocol.coreStack.map((pep: any, i: number) => (
              <div key={i} className="glass-panel p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-display font-semibold text-base text-accent-cyan">{pep.name}</h3>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-mono',
                    pep.riskLevel === 'low' ? 'text-accent-emerald bg-accent-emerald/10' :
                    pep.riskLevel === 'moderate' ? 'text-accent-amber bg-accent-amber/10' :
                    'text-accent-rose bg-accent-rose/10'
                  )}>{pep.riskLevel}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-text-muted">Mechanism:</span><p className="text-text-secondary">{pep.mechanism}</p></div>
                  <div><span className="text-text-muted">Why Selected:</span><p className="text-text-secondary">{pep.whySelected}</p></div>
                  <div><span className="text-text-muted">Synergy:</span><p className="text-text-secondary">{pep.synergyRole}</p></div>
                  <div className="pt-2 border-t border-surface-border">
                    <span className="text-text-muted text-xs">Dosing (Educational): </span>
                    <span className="text-accent-cyan font-mono text-xs">{pep.educationalDosing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {protocol.synergyAnalysis && (
        <div className="glass-panel p-5 sm:p-8">
          <h2 className="font-display font-bold text-lg sm:text-xl mb-4">🔗 Synergy Analysis</h2>
          <p className="text-sm text-text-secondary mb-4">{protocol.synergyAnalysis.overview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-display font-semibold text-accent-emerald mb-2">Amplifiers</h4>
              {protocol.synergyAnalysis.amplifiers?.map((a: string, i: number) => (
                <p key={i} className="text-xs text-text-secondary mb-1">+ {a}</p>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-display font-semibold text-accent-amber mb-2">Redundancies</h4>
              {protocol.synergyAnalysis.redundancies?.map((r: string, i: number) => (
                <p key={i} className="text-xs text-text-secondary mb-1">~ {r}</p>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-display font-semibold text-accent-rose mb-2">Warnings</h4>
              {protocol.synergyAnalysis.interactionWarnings?.map((w: string, i: number) => (
                <p key={i} className="text-xs text-text-secondary mb-1">! {w}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {protocol.weeklyTimeline && (
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl mb-4">📅 Weekly Timeline</h2>
          <div className="space-y-3">
            {protocol.weeklyTimeline.map((week: any, i: number) => (
              <div key={i} className="glass-panel p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-accent-cyan/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-text-muted">Week</span>
                  <span className="font-display font-bold text-sm text-accent-cyan">{week.week}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-sm text-accent-violet">{week.phase}</h4>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">{week.actions}</p>
                  <p className="text-xs text-text-muted mt-1">{week.expectations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel p-4 sm:p-6 border-accent-amber/20">
        <p className="text-xs text-text-muted text-center leading-relaxed">
          ⚠️ <strong>DISCLAIMER:</strong> For educational and research purposes only. Not medical advice. Consult a healthcare professional.
        </p>
      </div>
    </div>
  )
}

export default function GeneratorPage() {
  const [goal, setGoal] = useState('')
  const [gender, setGender] = useState('')
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [riskTolerance, setRiskTolerance] = useState(2)
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [notes, setNotes] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genStep, setGenStep] = useState('')
  const [protocol, setProtocol] = useState<GeneratedProtocol | null>(null)
  const [protocolId, setProtocolId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const { plan, user, addProtocol } = useAppStore()

  const handleGenerate = async () => {
    if (!goal) { setError('Please select a goal'); return }
    if (!gender) { setError('Please select your gender'); return }
    setError('')
    setIsGenerating(true)
    setProtocol(null)
    setProtocolId(null)
    setSaved(false)

    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setGenStep(GENERATION_STEPS[i])
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal, gender, experienceLevel: experience, riskTolerance, age,
          weight: weight ? Number(weight) : undefined,
          bodyFat: bodyFat ? Number(bodyFat) : undefined,
          additionalNotes: notes || undefined,
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Generation failed') }
      const data = await res.json()
      setProtocol(data.protocol)
      setProtocolId(data.protocolId || null)
      setSaved(!!data.saved)

      if (data.saved && data.protocolId) {
        addProtocol({
          id: data.protocolId, goal, created_at: new Date().toISOString(),
          protocol: data.protocol, credits_used: 0, status: 'active', currentWeek: 1,
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate protocol.')
    } finally {
      setIsGenerating(false)
      setGenStep('')
    }
  }

  const handleSave = async () => {
    if (!protocol || !user || saved) return
    try {
      const supabase = createClient()
      const { data, error: saveErr } = await supabase
        .from('protocols')
        .insert({
          user_id: user.id, goal, gender: gender || null,
          input: { goal, gender, experienceLevel: experience, riskTolerance, age },
          protocol, status: 'active', current_week: 1, credits_used: 0,
        })
        .select().single()

      if (!saveErr && data) {
        setProtocolId(data.id)
        setSaved(true)
        addProtocol({
          id: data.id, goal, created_at: new Date().toISOString(),
          protocol, credits_used: 0, status: 'active', currentWeek: 1,
        })
      }
    } catch (e) { console.error('Save error:', e) }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      {isGenerating && <GeneratingOverlay step={genStep} />}

      <div className="pt-24 sm:pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        {!protocol ? (
          <>
            <div className="mb-8 sm:mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 glass-panel-light mb-4 sm:mb-6">
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono text-text-secondary uppercase tracking-wider">AI Protocol Engine</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
                Protocol <span className="text-gradient">Generator</span>
              </h1>
              <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
                Configure your parameters. The AI engine designs a personalized protocol.
              </p>
              {plan === 'free' && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent-amber/10 border border-accent-amber/20 rounded-xl">
                  <span className="text-accent-amber text-sm">🔒 Paid feature -</span>
                  <Link href="/pricing" className="text-accent-cyan text-sm hover:underline">Upgrade to generate protocols</Link>
                </div>
              )}
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="glass-panel p-5 sm:p-8">
                <h3 className="font-display font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
                  <span className="text-accent-cyan">01</span> Select Your Goal
                </h3>
                <GoalSelector selected={goal} onSelect={setGoal} />
              </div>

              <div className="glass-panel p-5 sm:p-8">
                <h3 className="font-display font-semibold text-base sm:text-lg mb-6 flex items-center gap-2">
                  <span className="text-accent-cyan">02</span> Set Parameters
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-3 block">Gender</label>
                    <GenderSelector selected={gender} onSelect={setGender} />
                  </div>
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-3 block">Experience Level</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                        <button key={lvl} onClick={() => setExperience(lvl)}
                          className={cn('py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all min-h-[44px]',
                            experience === lvl ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                              : 'border-surface-border bg-surface-tertiary text-text-muted'
                          )}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</button>
                      ))}
                    </div>
                  </div>
                  <SliderInput label="Risk Tolerance" value={riskTolerance} onChange={setRiskTolerance} min={1} max={5} labels={['Conservative', 'Moderate', 'Aggressive']} />
                  <SliderInput label="Age" value={age} onChange={setAge} min={18} max={80} />
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-display font-medium text-text-secondary mb-2 block">Weight (lbs)</label>
                      <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Optional" className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-display font-medium text-text-secondary mb-2 block">Body Fat %</label>
                      <input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder="Optional" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-display font-medium text-text-secondary mb-2 block">Additional Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Symptoms, bloodwork, concerns..." rows={3} className="input-field resize-none" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="glass-panel p-4 border-accent-rose/30 text-center">
                  <p className="text-accent-rose text-sm">{error}</p>
                </div>
              )}

              <div className="text-center">
                <button onClick={handleGenerate} disabled={isGenerating || plan === 'free'}
                  className="btn-primary text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
                  {plan === 'free' ? '🔒 Upgrade to Generate' : isGenerating ? 'Generating...' : '⚡ Generate Protocol'}
                </button>
                {plan !== 'free' && <p className="text-xs text-text-muted mt-3">Unlimited with your {plan === 'pro' ? 'Pro' : 'Researcher'} subscription</p>}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Protocol Result Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <button onClick={() => { setProtocol(null); setProtocolId(null); setSaved(false) }}
                className="btn-secondary text-sm !py-2">← New Protocol</button>
              <div className="flex gap-3">
                {!saved ? (
                  <button onClick={handleSave} className="btn-secondary text-sm !py-2">💾 Save Protocol</button>
                ) : (
                  <Link href={protocolId ? `/protocol/${protocolId}` : '/dashboard'}
                    className="btn-secondary text-sm !py-2">✅ Saved - View Details</Link>
                )}
                {plan === 'pro' ? (
                  <button className="btn-primary text-sm !py-2" onClick={() => alert('PDF export coming soon!')}>
                    📄 Export PDF Report
                  </button>
                ) : (
                  <Link href="/pricing" className="btn-secondary text-sm !py-2 inline-flex items-center gap-1.5">
                    🔒 PDF Reports - <span className="text-accent-cyan">Pro Only</span>
                  </Link>
                )}
              </div>
            </div>
            <ProtocolReport protocol={protocol} />
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
