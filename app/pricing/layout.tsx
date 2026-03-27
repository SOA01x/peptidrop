import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Free Explorer, Researcher & Pro Plans',
  description: 'Peptidrop pricing: Free Explorer plan with 345+ peptide database. Researcher at $19/mo for AI protocol generation. Pro at $49/mo with clinical PDF reports, risk simulation, and advanced tools. Start free, upgrade anytime.',
  alternates: {
    canonical: 'https://peptidrop.me/pricing',
  },
  openGraph: {
    title: 'Peptidrop Pricing — Free to Start, AI Protocols from $19/mo',
    description: 'Explore 345+ peptides free. Researcher plan for AI protocols. Pro plan for clinical reports, risk simulation, and the full research suite.',
    url: 'https://peptidrop.me/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
