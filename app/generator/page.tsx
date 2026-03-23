// app/generator/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { useAppStore } from '@/lib/store'
import { GOALS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { GeneratedProtocol } from '@/lib/ai-engine'

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {GOALS.map((goal) => (
        <button
          key={goal.id}
          onClick={() => onSelect(goal.id)}
          className={cn(
            'p-4 rounded-xl border transition-all duration-300 text-left group',
            selected === goal.id
              ? 'border-accent-cyan/50 bg-accent-cyan/10 shadow-glow'
              : 'border-surface-border bg-surface-secondary hover:border-surface-border/80 hover:bg-surface-tertiary'
          )}
        >
          <span className="text-2xl block mb-2">{goal.icon}</span>
          <span className={cn(
            'font-display font-semibold text-sm',
            selected === goal.id ? 'text-accent-cyan' : 'text-text-primary'
          )}>
            {goal.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function SliderInput({ label, value, onChange, min, max, step = 1, labels }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; labels?: string[]
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-display font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-mono text-accent-cyan">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-surface-tertiary rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-pointer"
      />
      {labels && (
        <div className="flex justify-between mt-1">
          {labels.map((l, i) => (
            <span key={i} className="text-xs text-text-muted">{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function GeneratingOverlay({ step }: { step: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur-xl">
      <div className="text-center max-w-md">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-accent-cyan/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-3 border-2 border-accent-violet/20 rounded-full" />
          <div className="absolute inset-3 border-2 border-accent-violet border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🧬</span>
          </div>
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
    <div className="space-y-8">
      {/* Protocol Summary */}
      <div className="glass-panel glow-border p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-violet flex items-center justify-center">
            <span className="text-lg">📋</span>
          </div>
          <h2 className="font-display font-bold text-xl">Protocol Summary</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-cyan mb-1">Objective</h4>
            <p className="text-text-secondary">{protocol.protocolSummary.objective}</p>
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-violet mb-1">Strategic Reasoning</h4>
            <p className="text-text-secondary">{protocol.protocolSummary.strategicReasoning}</p>
          </div>
        </div>
      </div>

      {/* Core Stack */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <span>🧬</span> Core Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocol.coreStack.map((peptide, i) => (
            <div key={i} className="glass-panel p-6 card-hover">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-lg text-accent-cyan">{peptide.name}</h3>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-mono border',
                  peptide.riskLevel === 'low' ? 'text-accent-emerald border-accent-emerald/20 bg-accent-emerald/10' :
                  peptide.riskLevel === 'moderate' ? 'text-accent-amber border-accent-amber/20 bg-accent-amber/10' :
                  'text-accent-rose border-accent-rose/20 bg-accent-rose/10'
                )}>
                  {peptide.riskLevel}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-text-muted">Mechanism:</span>
                  <p className="text-text-secondary">{peptide.mechanism}</p>
                </div>
                <div>
                  <span className="text-text-muted">Why Selected:</span>
                  <p className="text-text-secondary">{peptide.whySelected}</p>
                </div>
                <div>
                  <span className="text-text-muted">Synergy Role:</span>
                  <p className="text-text-secondary">{peptide.synergyRole}</p>
                </div>
                <div className="flex justify-between pt-2 border-t border-surface-border/30">
                  <div>
                    <span className="text-text-muted text-xs">Dosing (Educational)</span>
                    <p className="text-accent-cyan font-mono text-xs">{peptide.educationalDosing}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted text-xs">Expected Results</span>
                    <p className="text-accent-violet text-xs">{peptide.timelineExpectation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synergy Analysis */}
      <div className="glass-panel p-8">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <span>🔗</span> Synergy Analysis
        </h2>
        <p className="text-text-secondary mb-4">{protocol.synergyAnalysis.overview}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-emerald mb-2">Amplifiers</h4>
            <ul className="space-y-1">
              {protocol.synergyAnalysis.amplifiers.map((a, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-accent-emerald mt-1">+</span>{a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-amber mb-2">Redundancies</h4>
            <ul className="space-y-1">
              {protocol.synergyAnalysis.redundancies.map((r, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-accent-amber mt-1">~</span>{r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-rose mb-2">Warnings</h4>
            <ul className="space-y-1">
              {protocol.synergyAnalysis.interactionWarnings.map((w, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-accent-rose mt-1">!</span>{w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Risk & Tradeoffs */}
      <div className="glass-panel p-8 border-accent-rose/10">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <span>⚠️</span> Risk & Tradeoffs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-rose mb-2">Side Effects</h4>
            <div className="flex flex-wrap gap-2">
              {protocol.riskAndTradeoffs.sideEffects.map((se, i) => (
                <span key={i} className="px-2 py-1 bg-accent-rose/10 border border-accent-rose/20 rounded text-xs text-accent-rose">{se}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-amber mb-2">Monitoring</h4>
            <ul className="space-y-1">
              {protocol.riskAndTradeoffs.monitoringRecommendations.map((m, i) => (
                <li key={i} className="text-sm text-text-secondary">• {m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <span>📅</span> Weekly Timeline
        </h2>
        <div className="space-y-3">
          {protocol.weeklyTimeline.map((week, i) => (
            <div key={i} className="glass-panel p-5 flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs text-text-muted">Week</span>
                <span className="font-display font-bold text-accent-cyan">{week.week}</span>
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-accent-violet">{week.phase}</h4>
                <p className="text-sm text-text-secondary mt-1">{week.actions}</p>
                <p className="text-xs text-text-muted mt-1">{week.expectations}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptation Logic */}
      <div className="glass-panel p-8">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <span>🔄</span> Adaptation Logic
        </h2>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-cyan mb-1">Plateau Response</h4>
            <p className="text-sm text-text-secondary">{protocol.adaptationLogic.plateauResponse}</p>
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-violet mb-1">Rotation Schedule</h4>
            <p className="text-sm text-text-secondary">{protocol.adaptationLogic.rotationSchedule}</p>
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-accent-amber mb-1">When to Stop</h4>
            <p className="text-sm text-text-secondary">{protocol.adaptationLogic.discontinuationCriteria}</p>
          </div>
        </div>
      </div>

      {/* Alternative Stacks */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <span>🔀</span> Alternative Stacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-6 border-accent-emerald/20">
            <h4 className="font-display font-semibold text-accent-emerald mb-2">Conservative Option</h4>
            <p className="text-sm text-text-secondary mb-3">{protocol.alternativeStacks.conservative.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {protocol.alternativeStacks.conservative.peptides.map((p, i) => (
                <span key={i} className="px-2 py-1 bg-accent-emerald/10 rounded text-xs text-accent-emerald font-mono">{p}</span>
              ))}
            </div>
            <p className="text-xs text-text-muted italic">{protocol.alternativeStacks.conservative.tradeoff}</p>
          </div>
          <div className="glass-panel p-6 border-accent-rose/20">
            <h4 className="font-display font-semibold text-accent-rose mb-2">Aggressive Option</h4>
            <p className="text-sm text-text-secondary mb-3">{protocol.alternativeStacks.aggressive.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {protocol.alternativeStacks.aggressive.peptides.map((p, i) => (
                <span key={i} className="px-2 py-1 bg-accent-rose/10 rounded text-xs text-accent-rose font-mono">{p}</span>
              ))}
            </div>
            <p className="text-xs text-text-muted italic">{protocol.alternativeStacks.aggressive.tradeoff}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-panel p-6 border-accent-amber/20">
        <p className="text-xs text-text-muted text-center leading-relaxed">
          ⚠️ <strong>DISCLAIMER:</strong> This protocol is generated for educational and research purposes only.
          All dosing information is educational and non-prescriptive. This is NOT medical advice.
          Always consult with a qualified healthcare professional before making any decisions regarding peptide use.
        </p>
      </div>
    </div>
  )
}

export default function GeneratorPage() {
  const [goal, setGoal] = useState('')
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [riskTolerance, setRiskTolerance] = useState(2)
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [notes, setNotes] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genStep, setGenStep] = useState('')
  const [protocol, setProtocol] = useState<GeneratedProtocol | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!goal) {
      setError('Please select a goal')
      return
    }
    setError('')
    setIsGenerating(true)
    setProtocol(null)

    // Simulate generation steps
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setGenStep(GENERATION_STEPS[i])
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          experienceLevel: experience,
          riskTolerance,
          age,
          weight: weight ? Number(weight) : undefined,
          bodyFat: bodyFat ? Number(bodyFat) : undefined,
          additionalNotes: notes || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      const data = await res.json()
      setProtocol(data.protocol)
    } catch (err: any) {
      setError(err.message || 'Failed to generate protocol. Please try again.')
    } finally {
      setIsGenerating(false)
      setGenStep('')
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {isGenerating && <GeneratingOverlay step={genStep} />}

      <div className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {!protocol ? (
          <>
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel-light mb-6">
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">AI Protocol Engine v2.0</span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
                Protocol <span className="text-gradient">Generator</span>
              </h1>
              <p className="text-text-secondary max-w-xl mx-auto">
                Configure your parameters and let the AI engine design a personalized peptide protocol tailored to your goals.
              </p>
            </div>

            {/* Control Center */}
            <div className="space-y-8">
              {/* Goal Selection */}
              <div className="glass-panel p-8">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="text-accent-cyan">01</span> Select Your Goal
                </h3>
                <GoalSelector selected={goal} onSelect={setGoal} />
              </div>

              {/* Parameters */}
              <div className="glass-panel p-8">
                <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                  <span className="text-accent-cyan">02</span> Set Parameters
                </h3>

                <div className="space-y-6">
                  {/* Experience Level */}
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-3 block">Experience Level</label>
                    <div className="flex gap-3">
                      {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setExperience(lvl)}
                          className={cn(
                            'flex-1 py-3 rounded-xl border text-sm font-medium transition-all',
                            experience === lvl
                              ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                              : 'border-surface-border bg-surface-tertiary text-text-muted hover:text-text-primary'
                          )}
                        >
                          {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders */}
                  <SliderInput
                    label="Risk Tolerance"
                    value={riskTolerance}
                    onChange={setRiskTolerance}
                    min={1} max={5}
                    labels={['Conservative', 'Moderate', 'Aggressive']}
                  />

                  <SliderInput
                    label="Age"
                    value={age}
                    onChange={setAge}
                    min={18} max={80}
                  />

                  {/* Optional Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Weight (lbs) — Optional</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g., 180"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Body Fat % — Optional</label>
                      <input
                        type="number"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        placeholder="e.g., 15"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Additional Notes — Optional</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Symptoms, bloodwork notes, specific concerns..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="glass-panel p-4 border-accent-rose/30 text-center">
                  <p className="text-accent-rose text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn-primary text-lg px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : '⚡ Generate Protocol — 1 Credit'}
                </button>
                <p className="text-xs text-text-muted mt-3">Uses 1 credit per generation</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back & Actions */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setProtocol(null)}
                className="btn-secondary text-sm py-2"
              >
                ← New Protocol
              </button>
              <div className="flex gap-3">
                <button className="btn-secondary text-sm py-2">
                  💾 Save
                </button>
                <button className="btn-primary text-sm py-2">
                  📄 Export PDF
                </button>
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
