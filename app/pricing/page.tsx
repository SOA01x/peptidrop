// app/pricing/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { PRICING_PLANS, REPORT_TYPES, cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

async function handlePurchase(
  type: 'subscription' | 'report',
  itemId: string,
  userId: string,
  setLoading: (v: boolean) => void,
  setError: (v: string) => void,
) {
  setLoading(true)
  setError('')
  try {
    const res = await fetch('/api/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        planId: type === 'subscription' ? itemId : undefined,
        reportType: type === 'report' ? itemId : undefined,
        userId,
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Payment failed')
    }
    const data = await res.json()
    // Redirect to NOWPayments hosted invoice page
    window.location.href = data.invoiceUrl
  } catch (err: any) {
    setError(err.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAppStore()

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto text-sm sm:text-base">
            Start free. Upgrade when you need AI-powered protocols and optimization.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'glass-panel p-6 sm:p-8 relative flex flex-col',
                plan.popular && 'glow-border'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full text-xs font-display font-semibold text-surface whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-bold text-xl mb-1">{plan.label}</h3>
                <p className="text-sm text-text-muted mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-display font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-display font-bold text-gradient">${plan.price}</span>
                      <span className="text-text-muted text-sm">{plan.period}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-accent-emerald mt-0.5 flex-shrink-0 text-sm">✓</span>
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((lim, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-text-muted mt-0.5 flex-shrink-0 text-sm">—</span>
                    <span className="text-sm text-text-muted">{lim}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {plan.id === 'free' ? (
                <Link href="/signup"
                  className="w-full text-center py-3.5 rounded-xl font-display font-semibold text-sm transition-all min-h-[44px] flex items-center justify-center btn-secondary">
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (!user) { window.location.href = '/signup'; return }
                    handlePurchase(
                      plan.id === 'pro' ? 'subscription' : 'report',
                      plan.id,
                      user.id,
                      setLoading,
                      setError,
                    )
                  }}
                  disabled={loading}
                  className={cn(
                    'w-full text-center py-3.5 rounded-xl font-display font-semibold text-sm transition-all min-h-[44px] flex items-center justify-center disabled:opacity-50',
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  )}
                >
                  {loading ? 'Processing...' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="glass-panel p-4 border-accent-rose/30 text-center mb-8">
            <p className="text-accent-rose text-sm">{error}</p>
          </div>
        )}

        {/* Clinical Reports Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
              Clinical-Grade <span className="text-gradient">Reports</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-sm sm:text-base">
              Export professional PDF protocols that look like they came from a clinic. Share with your practitioner or keep for reference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TYPES.map((report) => (
              <button
                key={report.id}
                onClick={() => {
                  if (!user) { window.location.href = '/signup'; return }
                  handlePurchase('report', report.id, user.id, setLoading, setError)
                }}
                disabled={loading}
                className="glass-panel p-5 sm:p-6 card-hover flex items-center justify-between gap-3 text-left disabled:opacity-50 w-full"
              >
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-sm">{report.label}</h4>
                  <p className="text-xs text-text-muted mt-0.5">Comprehensive clinical format</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-display font-bold text-accent-cyan">${report.price}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-text-muted">Each report includes full mechanism breakdowns, week-by-week timelines, risk discussion, and alternatives.</p>
          </div>
        </div>

        {/* What's Included Comparison */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 text-center">Feature Comparison</h2>
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border/30">
                    <th className="text-left p-4 font-display font-semibold text-text-secondary">Feature</th>
                    <th className="p-4 font-display font-semibold text-text-secondary text-center">Free</th>
                    <th className="p-4 font-display font-semibold text-accent-cyan text-center">Pro</th>
                    <th className="p-4 font-display font-semibold text-text-secondary text-center">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/20">
                  {[
                    { feature: 'Peptide Explorer (345+)', free: true, pro: true, report: true },
                    { feature: 'Basic Stack Builder', free: true, pro: true, report: true },
                    { feature: 'AI Protocol Generator', free: false, pro: true, report: false },
                    { feature: 'Unlimited Generations', free: false, pro: true, report: false },
                    { feature: '"What If" Scenarios', free: false, pro: true, report: false },
                    { feature: 'Risk Simulation', free: false, pro: true, report: false },
                    { feature: 'Protocol Refinement', free: false, pro: true, report: false },
                    { feature: 'Progress Tracking', free: false, pro: true, report: false },
                    { feature: 'Weekly AI Updates', free: false, pro: true, report: false },
                    { feature: 'Stack Builder Pro (Drag & Drop)', free: false, pro: true, report: false },
                    { feature: 'AI Coaching Suggestions', free: false, pro: true, report: false },
                    { feature: 'Saved Stacks (Unlimited)', free: false, pro: true, report: false },
                    { feature: 'Advanced Synergy Analysis', free: false, pro: true, report: false },
                    { feature: 'Clinical PDF Export', free: false, pro: false, report: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-tertiary/30 transition-colors">
                      <td className="p-4 text-text-secondary">{row.feature}</td>
                      <td className="p-4 text-center">{row.free ? <span className="text-accent-emerald">✓</span> : <span className="text-text-muted">—</span>}</td>
                      <td className="p-4 text-center">{row.pro ? <span className="text-accent-cyan">✓</span> : <span className="text-text-muted">—</span>}</td>
                      <td className="p-4 text-center">{row.report ? <span className="text-accent-emerald">✓</span> : <span className="text-text-muted">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I try the AI generator before subscribing?',
                a: 'The peptide explorer and basic stack builder are completely free. To access the AI protocol generator, you\'ll need a Pro subscription. We offer a 7-day trial so you can test everything risk-free.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept cryptocurrency payments including USDC, USDT, BTC, and SOL through Coinbase Commerce. Card payments may be available depending on your region.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel at any time. Your access continues until the end of your current billing period. There are no cancellation fees.',
              },
              {
                q: 'What\'s included in a clinical report?',
                a: 'Clinical reports are professionally formatted PDFs that include your full protocol with mechanism breakdowns, a week-by-week timeline, risk discussion, alternative stacks, and monitoring recommendations. They\'re designed to be shared with healthcare practitioners.',
              },
              {
                q: 'Is this medical advice?',
                a: 'No. Peptidrop provides educational information only. All content, including AI-generated protocols, is for research and educational purposes. Always consult a qualified healthcare professional before making health decisions.',
              },
            ].map((faq, i) => (
              <div key={i} className="glass-panel p-5 sm:p-6">
                <h3 className="font-display font-semibold text-sm sm:text-base mb-2">{faq.q}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
