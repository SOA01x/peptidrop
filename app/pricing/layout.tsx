import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Free Peptide Database Access & Pro AI Protocols',
  description: 'Peptidrop pricing: Free Explorer plan with full 345+ peptide database access. Pro plan at $29/month for AI protocol generation, synergy mapping, and weekly optimization. Clinical reports from $12.99. Start free, upgrade anytime.',
  alternates: {
    canonical: 'https://peptidrop.me/pricing',
  },
  openGraph: {
    title: 'Peptidrop Pricing — Free to Start, Pro AI Protocols at $29/mo',
    description: 'Explore 345+ peptides free. Upgrade to Pro for AI protocol generation, synergy mapping, risk simulation, and clinical reports.',
    url: 'https://peptidrop.me/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
