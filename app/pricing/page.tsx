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
    window.location.href = data.invoiceUrl
  } catch (err: any) {
    setError(err.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, plan } = useAppStore()

  const isCurrentPlan = (planId: string) => {
    if (!user) return false
    return plan === planId
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto text-sm sm:text-base">
            Start free. Upgrade when you need AI-powered protocols and advanced research tools.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {PRICING_PLANS.map((planItem) => (
            <div
              key={planItem.id}
              className={cn(
                'glass-panel p-6 sm:p-8 relative flex flex-col',
                planItem.popular && 'glow-border'
              )}
            >
              {planItem.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full text-xs font-display font-semibold text-surface whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-bold text-xl mb-1">{planItem.label}</h3>
                <p className="text-sm text-text-muted mb-4">{planItem.description}</p>
                <div className="flex items-baseline gap-1">
                  {planItem.price === 0 ? (
                    <span className="text-4xl font-display font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-display font-bold text-gradient">${planItem.price}</span>
                      <span className="text-text-muted text-sm">{planItem.period}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8 flex-1">
                {planItem.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-accent-emerald mt-0.5 flex-shrink-0 text-sm">✓</span>
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
                {planItem.limitations.map((lim, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-text-muted mt-0.5 flex-shrink-0 text-sm">-</span>
                    <span className="text-sm text-text-muted">{lim}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {isCurrentPlan(planItem.id) ? (
                <div className="w-full text-center py-3.5 rounded-xl font-display font-semibold text-sm border border-accent-emerald/30 text-accent-emerald min-h-[44px] flex items-center justify-center">
                  ✓ Current Plan
                </div>
              ) : planItem.id === 'free' ? (
                <Link href="/signup"
                  className="w-full text-center py-3.5 rounded-xl font-display font-semibold text-sm transition-all min-h-[44px] flex items-center justify-center btn-secondary">
                  {planItem.cta}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    if (!user) { window.location.href = '/signup'; return }
                    handlePurchase('subscription', planItem.id, user.id, setLoading, setError)
                  }}
                  disabled={loading}
                  className={cn(
                    'w-full text-center py-3.5 rounded-xl font-display font-semibold text-sm transition-all min-h-[44px] flex items-center justify-center disabled:opacity-50',
                    planItem.popular ? 'btn-primary' : 'btn-secondary'
                  )}
                >
                  {loading ? 'Processing...' : planItem.cta}
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

        {/* Clinical Reports Section - Pro Included */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
              Clinical-Grade <span className="text-gradient">Reports</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto text-sm sm:text-base">
              Professional PDF protocols with full mechanism breakdowns, week-by-week timelines, risk discussion, and alternatives.
            </p>
            {plan === 'pro' ? (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/20 rounded-xl">
                <span className="text-accent-cyan text-sm font-display font-semibold">✓ Included with your Pro plan</span>
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent-amber/10 border border-accent-amber/20 rounded-xl">
                <span className="text-accent-amber text-sm">🔒</span>
                <span className="text-sm text-text-secondary">Included with Pro plan - </span>
                <Link href="#" onClick={(e) => {
                  e.preventDefault()
                  if (!user) { window.location.href = '/signup'; return }
                  handlePurchase('subscription', 'pro', user.id, setLoading, setError)
                }} className="text-accent-cyan text-sm hover:underline font-medium">Upgrade to Pro</Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TYPES.map((report) => (
              <div
                key={report.id}
                className={cn(
                  'glass-panel p-5 sm:p-6 flex items-center justify-between gap-3 text-left w-full',
                  plan !== 'pro' && 'opacity-60'
                )}
              >
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-sm">{report.label}</h4>
                  <p className="text-xs text-text-muted mt-0.5">Comprehensive clinical format</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  {plan === 'pro' ? (
                    <span className="text-xs font-display font-semibold text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-full">Included</span>
                  ) : (
                    <span className="text-xs font-display text-text-muted">Pro only</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-text-muted">Each report includes full mechanism breakdowns, week-by-week timelines, risk discussion, and alternatives.</p>
          </div>
        </div>

        {/* Crypto Payments */}
        <div className="mb-16 sm:mb-20">
          <div className="glass-panel glow-border p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-violet/5" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel-light mb-6">
                <span className="text-base">🔗</span>
                <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Decentralized Payments</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
                We Believe in <span className="text-gradient">Decentralization</span>
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base mb-6 leading-relaxed">
                Peptidrop is built for the sovereign individual. We accept cryptocurrency because we believe your health research
                should be as private and permissionless as the science itself. No banks, no middlemen, no data harvesting - just
                peer-to-peer value exchange powered by blockchain technology.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
                {['USDC', 'USDT', 'BTC', 'ETH', 'SOL', 'LTC'].map((coin) => (
                  <div key={coin} className="px-4 py-2 glass-panel-light rounded-lg">
                    <span className="text-xs font-mono font-semibold text-text-secondary">{coin}</span>
                  </div>
                ))}
                <div className="px-4 py-2 glass-panel-light rounded-lg">
                  <span className="text-xs font-mono text-text-muted">+300 more</span>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Powered by NOWPayments - instant settlement, no chargebacks, global access. Your subscription activates the moment your transaction confirms on-chain.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 text-center">Feature Comparison</h2>
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border/30">
                    <th className="text-left p-4 font-display font-semibold text-text-secondary">Feature</th>
                    <th className="p-4 font-display font-semibold text-text-secondary text-center">Explorer</th>
                    <th className="p-4 font-display font-semibold text-accent-cyan text-center">Pro</th>
                    <th className="p-4 font-display font-semibold text-accent-violet text-center">Researcher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/20">
                  {[
                    { feature: 'Peptide Explorer (345+)', free: true, pro: true, researcher: true },
                    { feature: 'Basic Stack Builder', free: true, pro: true, researcher: true },
                    { feature: 'Community Synergy Data', free: true, pro: true, researcher: true },
                    { feature: 'Educational Dosing References', free: true, pro: true, researcher: true },
                    { feature: 'AI Protocol Generator (Unlimited)', free: false, pro: true, researcher: true },
                    { feature: 'Save & Revisit Protocols', free: false, pro: true, researcher: true },
                    { feature: 'Protocol Refinement & "What If"', free: false, pro: true, researcher: true },
                    { feature: 'Progress Tracking & Weekly Updates', free: false, pro: true, researcher: true },
                    { feature: 'Progress Journal', free: false, pro: true, researcher: true },
                    { feature: 'PDF Clinical-Grade Reports', free: false, pro: true, researcher: false },
                    { feature: 'Saved Stacks (Unlimited)', free: false, pro: true, researcher: false },
                    { feature: 'Stack Builder Pro (Drag & Drop)', free: false, pro: true, researcher: false },
                    { feature: 'AI Coaching Suggestions', free: false, pro: true, researcher: false },
                    { feature: 'Advanced Synergy Analysis', free: false, pro: true, researcher: false },
                    { feature: 'Real Risk Simulation Engine', free: false, pro: true, researcher: false },
                    { feature: 'Priority Support', free: false, pro: true, researcher: false },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-tertiary/30 transition-colors">
                      <td className="p-4 text-text-secondary">{row.feature}</td>
                      <td className="p-4 text-center">{row.free ? <span className="text-accent-emerald">✓</span> : <span className="text-text-muted">-</span>}</td>
                      <td className="p-4 text-center">{row.pro ? <span className="text-accent-cyan">✓</span> : <span className="text-text-muted">-</span>}</td>
                      <td className="p-4 text-center">{row.researcher ? <span className="text-accent-violet">✓</span> : <span className="text-text-muted">-</span>}</td>
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
                q: 'What\'s the difference between Researcher and Pro?',
                a: 'Researcher gives you unlimited AI protocol generation, progress tracking, and the ability to save and revisit protocols. Pro adds clinical-grade PDF reports, unlimited saved stacks with drag-and-drop building, AI coaching suggestions, advanced synergy analysis, and the real risk simulation engine.',
              },
              {
                q: 'Can I try the AI generator before subscribing?',
                a: 'The peptide explorer and basic stack builder are completely free. To access the AI protocol generator, you\'ll need at least a Researcher subscription.',
              },
              {
                q: 'Are clinical reports included with Pro?',
                a: 'Yes! Pro plan includes unlimited clinical-grade PDF reports for all protocol types. No per-report fees - generate as many as you need.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We believe in decentralization and financial sovereignty. We accept 300+ cryptocurrencies including USDC, USDT, BTC, ETH, SOL, and LTC through NOWPayments. Your subscription activates instantly when your transaction confirms on-chain. No banks, no middlemen - just peer-to-peer value exchange.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel at any time. Your access continues until the end of your current billing period. There are no cancellation fees.',
              },
              {
                q: 'Can I upgrade from Researcher to Pro?',
                a: 'Absolutely. When you upgrade, you immediately get access to all Pro features. Your billing will be adjusted to reflect the Pro pricing.',
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
