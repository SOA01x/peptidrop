// app/protocol/[id]/journal/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface JournalEntry {
  id: string
  week: number
  date: string
  mood: number
  energy: number
  sleep_quality: number
  side_effects: string[]
  notes: string
  bloodwork: string
  created_at: string
}

const SIDE_EFFECT_OPTIONS = [
  'Water retention', 'Tingling/numbness', 'Fatigue', 'Headache',
  'Nausea', 'Injection site pain', 'Appetite changes', 'Mood changes',
  'Joint pain', 'Flushing', 'Dizziness', 'Insomnia', 'Vivid dreams', 'None'
]

export default function JournalPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAppStore()
  const [protocol, setProtocol] = useState<any>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formMood, setFormMood] = useState(5)
  const [formEnergy, setFormEnergy] = useState(5)
  const [formSleep, setFormSleep] = useState(5)
  const [formSideEffects, setFormSideEffects] = useState<string[]>([])
  const [formNotes, setFormNotes] = useState('')
  const [formBloodwork, setFormBloodwork] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!params.id) return
      const supabase = createClient()

      // Load protocol
      const { data: proto } = await supabase
        .from('protocols').select('*').eq('id', params.id).maybeSingle()
      setProtocol(proto)

      // Load journal entries
      const { data: journalEntries } = await supabase
        .from('progress_entries').select('*').eq('protocol_id', params.id)
        .order('week', { ascending: true })

      setEntries((journalEntries || []).map((e: any) => ({
        id: e.id, week: e.week, date: e.created_at.split('T')[0],
        mood: e.rating || 5, energy: 5, sleep_quality: 5,
        side_effects: e.side_effects || [],
        notes: e.notes || '', bloodwork: e.adjustments || '',
        created_at: e.created_at,
      })))

      setLoading(false)
    }
    load()
  }, [params.id])

  const totalWeeks = protocol?.protocol?.weeklyTimeline?.length || 12

  const weeksWithEntries = useMemo(() => {
    const map = new Map<number, JournalEntry[]>()
    entries.forEach(e => {
      const existing = map.get(e.week) || []
      map.set(e.week, [...existing, e])
    })
    return map
  }, [entries])

  const handleSaveEntry = async () => {
    if (!user || !params.id || selectedWeek === null) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('progress_entries')
        .insert({
          user_id: user.id,
          protocol_id: params.id,
          week: selectedWeek,
          rating: formMood,
          notes: formNotes,
          adjustments: formBloodwork,
          side_effects: formSideEffects,
        })
        .select().single()

      if (!error && data) {
        setEntries(prev => [...prev, {
          id: data.id, week: selectedWeek, date: formDate,
          mood: formMood, energy: formEnergy, sleep_quality: formSleep,
          side_effects: formSideEffects, notes: formNotes, bloodwork: formBloodwork,
          created_at: data.created_at,
        }])
        setShowForm(false)
        setFormNotes('')
        setFormBloodwork('')
        setFormSideEffects([])
        setFormMood(5)
      }
    } catch (e) { console.error('Save journal error:', e) }
    setSaving(false)
  }

  const toggleSideEffect = (se: string) => {
    setFormSideEffects(prev =>
      prev.includes(se) ? prev.filter(s => s !== se) : [...prev, se]
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen"><Navigation />
        <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-pulse"><div className="h-8 bg-surface-tertiary rounded-lg max-w-xs mx-auto mb-4" /></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24 sm:pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button onClick={() => router.push(`/protocol/${params.id}`)}
            className="text-sm text-text-muted hover:text-accent-cyan mb-2 flex items-center gap-1">← Back to Protocol</button>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1">Progress Journal</h1>
          <p className="text-text-muted text-sm">{protocol?.goal || 'Protocol'} - Track your weekly experience</p>
        </div>

        {/* Week Grid */}
        <div className="glass-panel p-5 sm:p-8 mb-6">
          <h3 className="font-display font-semibold text-base mb-4">Select a Week</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => {
              const hasEntries = weeksWithEntries.has(week)
              const isSelected = selectedWeek === week
              const entryCount = weeksWithEntries.get(week)?.length || 0
              return (
                <button key={week} onClick={() => { setSelectedWeek(week); setShowForm(false) }}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center text-center border transition-all min-h-[56px]',
                    isSelected ? 'border-accent-cyan bg-accent-cyan/10' :
                    hasEntries ? 'border-accent-emerald/40 bg-accent-emerald/5' :
                    'border-surface-border bg-surface-tertiary hover:border-accent-cyan/30'
                  )}>
                  <span className="text-[10px] text-text-muted">W{week}</span>
                  {hasEntries && <span className="text-[10px] font-mono text-accent-emerald">{entryCount}</span>}
                  {hasEntries && <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald mt-0.5" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Week View */}
        {selectedWeek !== null && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Week {selectedWeek}</h3>
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm !py-2">+ New Entry</button>
            </div>

            {/* Existing entries for this week */}
            {(weeksWithEntries.get(selectedWeek) || []).map(entry => (
              <div key={entry.id} className="glass-panel p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-text-muted">{new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <div className="flex gap-3">
                    <span className="text-xs"><span className="text-text-muted">Mood:</span> <span className="text-accent-cyan font-mono">{entry.mood}/10</span></span>
                  </div>
                </div>
                {entry.notes && <p className="text-sm text-text-secondary mb-3">{entry.notes}</p>}
                {entry.side_effects.length > 0 && entry.side_effects[0] !== 'None' && (
                  <div className="mb-3">
                    <span className="text-xs text-text-muted">Side effects: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.side_effects.map(se => (
                        <span key={se} className="px-2 py-0.5 rounded text-[10px] text-accent-rose bg-accent-rose/10">{se}</span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.bloodwork && (
                  <div>
                    <span className="text-xs text-text-muted">Bloodwork/Labs: </span>
                    <p className="text-sm text-text-secondary mt-1">{entry.bloodwork}</p>
                  </div>
                )}
              </div>
            ))}

            {(weeksWithEntries.get(selectedWeek) || []).length === 0 && !showForm && (
              <div className="glass-panel p-8 text-center">
                <p className="text-text-muted text-sm mb-4">No entries for week {selectedWeek} yet</p>
                <button onClick={() => setShowForm(true)} className="btn-primary text-sm">Add Your First Entry</button>
              </div>
            )}

            {/* New Entry Form */}
            {showForm && (
              <div className="glass-panel p-5 sm:p-8">
                <h4 className="font-display font-semibold text-base mb-4">New Journal Entry - Week {selectedWeek}</h4>

                <div className="space-y-5">
                  {/* Date */}
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Date</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="input-field max-w-xs" />
                  </div>

                  {/* Mood slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-display font-medium text-text-secondary">Overall Mood / Feeling</label>
                      <span className="text-sm font-mono text-accent-cyan">{formMood}/10</span>
                    </div>
                    <input type="range" min={1} max={10} value={formMood} onChange={(e) => setFormMood(Number(e.target.value))}
                      className="w-full h-2 bg-surface-tertiary rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-text-muted mt-1">
                      <span>Terrible</span><span>Amazing</span>
                    </div>
                  </div>

                  {/* Side Effects */}
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-3 block">Side Effects Experienced</label>
                    <div className="flex flex-wrap gap-2">
                      {SIDE_EFFECT_OPTIONS.map(se => (
                        <button key={se} onClick={() => toggleSideEffect(se)}
                          className={cn('px-3 py-1.5 rounded-lg text-xs transition-all min-h-[32px]',
                            formSideEffects.includes(se)
                              ? se === 'None' ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30'
                                : 'bg-accent-rose/20 text-accent-rose border border-accent-rose/30'
                              : 'bg-surface-tertiary text-text-muted border border-transparent hover:border-surface-border'
                          )}>{se}</button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Notes - How are you feeling? What do you notice?</label>
                    <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Energy levels, physical changes, mental clarity, sleep quality, anything you noticed..."
                      rows={4} className="input-field resize-none" />
                  </div>

                  {/* Bloodwork */}
                  <div>
                    <label className="text-sm font-display font-medium text-text-secondary mb-2 block">Bloodwork / Lab Results (optional)</label>
                    <textarea value={formBloodwork} onChange={(e) => setFormBloodwork(e.target.value)}
                      placeholder="Fasting glucose: 92 mg/dL, IGF-1: 210 ng/mL, Testosterone: 650 ng/dL..."
                      rows={3} className="input-field resize-none" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSaveEntry} disabled={saving}
                      className="btn-primary text-sm !py-2.5 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Entry'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="btn-secondary text-sm !py-2.5">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedWeek === null && (
          <div className="glass-panel p-8 text-center">
            <span className="text-3xl block mb-3">📓</span>
            <p className="text-text-muted text-sm">Click on a week above to view or add journal entries</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
