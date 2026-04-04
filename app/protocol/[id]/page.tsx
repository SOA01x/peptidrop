// app/protocol/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { jsPDF } from 'jspdf'
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
  const [deactivating, setDeactivating] = useState(false)
  const plan = useAppStore((s) => s.plan)
  const updateProtocolStatus = useAppStore((s) => s.updateProtocolStatus)

  const handleDeactivate = async () => {
    if (!data || deactivating) return
    setDeactivating(true)
    try {
      const supabase = createClient()
      const newStatus = data.status === 'paused' ? 'active' : 'paused'
      const { error: err } = await supabase
        .from('protocols')
        .update({ status: newStatus })
        .eq('id', data.id)
      if (!err) {
        setData({ ...data, status: newStatus })
        updateProtocolStatus(data.id, newStatus)
      }
    } catch (e) { console.error(e) }
    setDeactivating(false)
  }

  const handleExportPDF = () => {
    if (!data || !data.protocol) return
    const p = data.protocol
    const doc = new jsPDF()
    const pw = doc.internal.pageSize.getWidth()
    const ph = doc.internal.pageSize.getHeight()
    const margin = 22
    const maxW = pw - margin * 2
    let y = 0
    let pageNum = 0

    // --- Draw watermark logo (concentric circles at 10% opacity, ~500px equivalent) ---
    const drawLogo = () => {
      const cx = pw / 2, cy = ph / 2, scale = 0.95 // large ~500px equivalent
      doc.setGState(new (doc as any).GState({ opacity: 0.10 }))
      // Outer dotted circle
      doc.setDrawColor(232, 197, 71)
      doc.setLineWidth(2.5)
      const r1 = 90 * scale, segments = 48
      for (let i = 0; i < segments; i++) {
        if (i % 2 === 0) {
          const a1 = (i / segments) * 2 * Math.PI
          const a2 = ((i + 1) / segments) * 2 * Math.PI
          doc.line(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1, cx + Math.cos(a2) * r1, cy + Math.sin(a2) * r1)
        }
      }
      // Middle solid circle
      doc.setLineWidth(6)
      doc.circle(cx, cy, 58 * scale, 'S')
      // Center filled dot
      doc.setFillColor(232, 197, 71)
      doc.circle(cx, cy, 8 * scale, 'F')
      doc.setGState(new (doc as any).GState({ opacity: 1 }))
    }

    // --- Page setup: navy bg + logo + header/footer ---
    const setupPage = () => {
      pageNum++
      doc.setFillColor(13, 27, 42)
      doc.rect(0, 0, pw, ph, 'F')

      // Subtle gradient overlay at top
      doc.setFillColor(18, 35, 55)
      doc.rect(0, 0, pw, 50, 'F')

      // Top gold accent line
      doc.setFillColor(232, 197, 71)
      doc.rect(0, 0, pw, 1.2, 'F')

      // Watermark logo
      drawLogo()

      // Header
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(232, 197, 71)
      doc.text('PEPTIDROP', margin, 10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 115, 140)
      doc.text('AI Peptide Intelligence Platform', margin + 24, 10)

      // Page number
      doc.setFontSize(7)
      doc.setTextColor(80, 95, 115)
      doc.text(`${pageNum}`, pw - margin, ph - 8, { align: 'right' })

      // Bottom accent line
      doc.setFillColor(232, 197, 71)
      doc.rect(0, ph - 1.2, pw, 1.2, 'F')

      // Bottom footer
      doc.setFontSize(6)
      doc.setTextColor(70, 85, 105)
      doc.text('peptidrop.me  |  For educational and research purposes only', margin, ph - 8)

      y = 18
    }

    const newPage = () => { doc.addPage(); setupPage() }

    // --- Section heading with gold underline ---
    const addSection = (title: string) => {
      checkPage(18)
      y += 4
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(232, 197, 71)
      doc.text(title.toUpperCase(), margin, y)
      y += 2
      doc.setFillColor(232, 197, 71)
      doc.rect(margin, y, 40, 0.6, 'F')
      doc.setFillColor(50, 65, 85)
      doc.rect(margin + 40, y, maxW - 40, 0.3, 'F')
      y += 6
    }

    // --- Body text ---
    const addText = (text: string, size: number, bold: boolean, color: [number, number, number] = [200, 205, 215]) => {
      doc.setFontSize(size)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setTextColor(color[0], color[1], color[2])
      const lines = doc.splitTextToSize(text, maxW)
      if (y + lines.length * size * 0.45 > ph - 18) { newPage() }
      doc.text(lines, margin, y)
      y += lines.length * size * 0.42 + 2
    }

    // --- Label + value pair ---
    const addField = (label: string, value: string) => {
      checkPage(10)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(140, 155, 175)
      doc.text(label.toUpperCase(), margin + 2, y)
      y += 3.5
      addText(value, 8.5, false, [195, 200, 215])
    }

    // --- Rounded card background ---
    const addCard = (height: number) => {
      checkPage(height + 4)
      doc.setFillColor(18, 35, 55)
      doc.setDrawColor(40, 58, 80)
      doc.setLineWidth(0.3)
      doc.roundedRect(margin - 2, y - 2, maxW + 4, height, 3, 3, 'FD')
    }

    // --- Risk badge ---
    const addRiskBadge = (risk: string, x: number, bY: number) => {
      const colors: Record<string, [number, number, number]> = {
        low: [74, 222, 128], moderate: [232, 197, 71], high: [239, 68, 68], 'very-high': [255, 0, 64]
      }
      const col = colors[risk] || [232, 197, 71]
      doc.setFillColor(col[0], col[1], col[2])
      doc.setGState(new (doc as any).GState({ opacity: 0.15 }))
      doc.roundedRect(x, bY - 3, 22, 5, 2, 2, 'F')
      doc.setGState(new (doc as any).GState({ opacity: 1 }))
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(col[0], col[1], col[2])
      doc.text(risk.toUpperCase(), x + 11, bY, { align: 'center' })
    }

    const checkPage = (needed: number) => { if (y + needed > ph - 18) { newPage() } }

    // --- Bulleted item (circle + indented text) ---
    const addBullet = (text: string, bulletColor: [number, number, number]) => {
      checkPage(10)
      doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2])
      doc.circle(margin + 3, y + 1, 1.2, 'F')
      // Render text indented past the bullet
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 185, 200)
      const lines = doc.splitTextToSize(text, maxW - 10)
      if (y + lines.length * 3.5 > ph - 18) { newPage() }
      doc.text(lines, margin + 8, y + 2.5)
      y += lines.length * 3.5 + 2
    }

    // ============ BUILD PDF ============

    // Page 1 - Cover
    setupPage()
    y = 60

    // Large title
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    const titleLines = doc.splitTextToSize(data.goal, maxW)
    doc.text(titleLines, margin, y)
    y += titleLines.length * 12 + 4

    // Gold divider
    doc.setFillColor(232, 197, 71)
    doc.rect(margin, y, 50, 1.5, 'F')
    y += 10

    // Meta info
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 170, 190)
    doc.text(`Generated: ${new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, y)
    y += 5
    doc.text(`Status: ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}  |  Gender: ${data.gender || 'Not specified'}`, margin, y)
    y += 12

    // Summary on cover
    if (p.protocolSummary) {
      if (p.protocolSummary.objective) {
        addField('Objective', p.protocolSummary.objective)
        y += 2
      }
      if (p.protocolSummary.strategicReasoning) {
        addField('Strategic Reasoning', p.protocolSummary.strategicReasoning)
      }
    }

    // Core Stack
    if (p.coreStack?.length) {
      newPage()
      addSection(`Core Stack - ${p.coreStack.length} Peptides`)

      p.coreStack.forEach((pep: any, idx: number) => {
        const cardH = 38 + (pep.mechanism ? 8 : 0) + (pep.whySelected ? 8 : 0)
        checkPage(cardH + 6)
        addCard(cardH)

        const cardTop = y
        // Peptide name
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(232, 197, 71)
        doc.text(pep.name, margin + 4, y + 4)

        // Risk badge
        if (pep.riskLevel) addRiskBadge(pep.riskLevel, pw - margin - 24, y + 4)

        y += 10
        if (pep.mechanism) { addField('Mechanism', pep.mechanism) }
        if (pep.whySelected) { addField('Why Selected', pep.whySelected) }
        if (pep.synergyRole) { addField('Synergy Role', pep.synergyRole) }

        // Dosing bar
        if (pep.educationalDosing) {
          checkPage(10)
          doc.setFillColor(24, 44, 68)
          doc.roundedRect(margin, y, maxW, 7, 2, 2, 'F')
          doc.setFontSize(7)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(232, 197, 71)
          doc.text(`DOSING: ${pep.educationalDosing}`, margin + 4, y + 5)
          if (pep.frequency) {
            doc.setTextColor(140, 155, 175)
            doc.text(`FREQ: ${pep.frequency}`, pw - margin - 4, y + 5, { align: 'right' })
          }
          y += 11
        }

        y += 4
      })
    }

    // Timeline
    if (p.weeklyTimeline?.length) {
      newPage()
      addSection('Weekly Timeline')

      p.weeklyTimeline.forEach((week: any) => {
        checkPage(18)
        // Week number badge
        doc.setFillColor(232, 197, 71)
        doc.setGState(new (doc as any).GState({ opacity: 0.12 }))
        doc.roundedRect(margin, y - 2, 16, 8, 2, 2, 'F')
        doc.setGState(new (doc as any).GState({ opacity: 1 }))
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(232, 197, 71)
        doc.text(`W${week.week}`, margin + 8, y + 3, { align: 'center' })

        // Phase name
        doc.setFontSize(9)
        doc.setTextColor(230, 235, 245)
        doc.text(week.phase || '', margin + 20, y + 3)
        y += 8

        if (week.actions) addText(week.actions, 8, false, [180, 185, 200])
        if (week.expectations) addText(week.expectations, 7.5, false, [130, 145, 165])
        y += 3

        // Subtle separator
        doc.setFillColor(35, 50, 70)
        doc.rect(margin + 6, y, maxW - 12, 0.2, 'F')
        y += 3
      })
    }

    // Risk & Safety
    if (p.riskAndTradeoffs) {
      newPage()
      addSection('Risk & Safety')

      if (p.riskAndTradeoffs.sideEffects?.length) {
        addText('Side Effects', 9, true, [200, 205, 215])
        y += 1
        // Tag-style badges
        let tagX = margin
        p.riskAndTradeoffs.sideEffects.forEach((se: string) => {
          doc.setFontSize(7)
          const tw = doc.getTextWidth(se) + 8
          if (tagX + tw > pw - margin) { tagX = margin; y += 7 }
          checkPage(8)
          doc.setFillColor(239, 68, 68)
          doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
          doc.roundedRect(tagX, y - 3, tw, 6, 2, 2, 'F')
          doc.setGState(new (doc as any).GState({ opacity: 1 }))
          doc.setTextColor(239, 130, 130)
          doc.text(se, tagX + 4, y + 0.5)
          tagX += tw + 3
        })
        y += 10
      }

      if (p.riskAndTradeoffs.suppressionRisks?.length) {
        addText('Suppression Risks', 9, true, [200, 205, 215])
        y += 1
        p.riskAndTradeoffs.suppressionRisks.forEach((r: string) => {
          addBullet(r, [239, 68, 68])
        })
        y += 4
      }

      if (p.riskAndTradeoffs.longTermConsiderations?.length) {
        addText('Long-Term Considerations', 9, true, [200, 205, 215])
        y += 1
        p.riskAndTradeoffs.longTermConsiderations.forEach((c: string) => {
          addBullet(c, [232, 197, 71])
        })
        y += 4
      }

      if (p.riskAndTradeoffs.monitoringRecommendations?.length) {
        addText('Monitoring Recommendations', 9, true, [200, 205, 215])
        y += 1
        p.riskAndTradeoffs.monitoringRecommendations.forEach((m: string) => {
          addBullet(m, [74, 222, 128])
        })
      }
    }

    // Alternatives
    if (p.alternativeStacks) {
      newPage()
      addSection('Alternative Stacks')

      if (p.alternativeStacks.conservative) {
        addText('Conservative Option', 10, true, [74, 222, 128])
        y += 1
        if (p.alternativeStacks.conservative.description) addText(p.alternativeStacks.conservative.description, 8.5, false, [180, 185, 200])
        if (p.alternativeStacks.conservative.peptides?.length) {
          y += 2
          let tagX = margin
          p.alternativeStacks.conservative.peptides.forEach((name: string) => {
            doc.setFontSize(7)
            const tw = doc.getTextWidth(name) + 8
            if (tagX + tw > pw - margin) { tagX = margin; y += 7 }
            doc.setFillColor(74, 222, 128)
            doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
            doc.roundedRect(tagX, y - 3, tw, 6, 2, 2, 'F')
            doc.setGState(new (doc as any).GState({ opacity: 1 }))
            doc.setTextColor(74, 222, 128)
            doc.text(name, tagX + 4, y + 0.5)
            tagX += tw + 3
          })
          y += 8
        }
        if (p.alternativeStacks.conservative.tradeoff) addText(`Tradeoff: ${p.alternativeStacks.conservative.tradeoff}`, 7.5, false, [140, 150, 170])
        y += 6
      }

      if (p.alternativeStacks.aggressive) {
        addText('Aggressive Option', 10, true, [239, 68, 68])
        y += 1
        if (p.alternativeStacks.aggressive.description) addText(p.alternativeStacks.aggressive.description, 8.5, false, [180, 185, 200])
        if (p.alternativeStacks.aggressive.peptides?.length) {
          y += 2
          let tagX = margin
          p.alternativeStacks.aggressive.peptides.forEach((name: string) => {
            doc.setFontSize(7)
            const tw = doc.getTextWidth(name) + 8
            if (tagX + tw > pw - margin) { tagX = margin; y += 7 }
            doc.setFillColor(239, 68, 68)
            doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
            doc.roundedRect(tagX, y - 3, tw, 6, 2, 2, 'F')
            doc.setGState(new (doc as any).GState({ opacity: 1 }))
            doc.setTextColor(239, 68, 68)
            doc.text(name, tagX + 4, y + 0.5)
            tagX += tw + 3
          })
          y += 8
        }
        if (p.alternativeStacks.aggressive.tradeoff) addText(`Tradeoff: ${p.alternativeStacks.aggressive.tradeoff}`, 7.5, false, [140, 150, 170])
      }
    }

    // Final disclaimer page footer
    checkPage(20)
    y += 8
    doc.setFillColor(30, 45, 65)
    doc.roundedRect(margin, y, maxW, 14, 3, 3, 'F')
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(232, 197, 71)
    doc.text('DISCLAIMER', margin + 4, y + 5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 135, 155)
    doc.text('This protocol is generated by AI for educational and research purposes only. Not medical advice. Consult a healthcare professional.', margin + 4, y + 10)

    doc.save(`peptidrop-protocol-${data.goal.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}.pdf`)
  }

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
                backgroundColor: data.status === 'active' ? 'rgba(74,222,128,0.1)' :
                  data.status === 'completed' ? 'rgba(232,197,71,0.1)' : 'rgba(232,197,71,0.1)',
              }}>
                {data.status}
              </span>
              {data.gender && <span className="text-xs text-text-muted capitalize">{data.gender}</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {plan === 'pro' && (
              <button onClick={handleExportPDF} className="btn-primary text-sm !py-2">
                PDF Export
              </button>
            )}
            {data.status !== 'completed' && (
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors border min-h-[40px]',
                  data.status === 'paused'
                    ? 'border-accent-emerald/30 text-accent-emerald hover:bg-accent-emerald/10'
                    : 'border-accent-rose/30 text-accent-rose hover:bg-accent-rose/10'
                )}
              >
                {deactivating ? '...' : data.status === 'paused' ? 'Reactivate' : 'Deactivate'}
              </button>
            )}
            <Link href={`/protocol/${params.id}/journal`} className="btn-primary text-sm !py-2">📓 Journal</Link>
          </div>
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
              style={activeTab === tab.key ? { backgroundColor: 'rgba(232,197,71,0.1)' } : {}}>
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
                        style={{ background: 'linear-gradient(135deg, rgba(232,197,71,0.1), rgba(232,197,71,0.05))' }}>
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
