import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation — How to Use Peptidrop AI Peptide Platform',
  description: 'Complete documentation for Peptidrop. Learn how to use the peptide database, AI protocol generator, synergy mapping, risk simulation, and clinical report exports. Includes disclaimers, terms, and privacy information.',
  alternates: {
    canonical: 'https://peptidrop.me/docs',
  },
  openGraph: {
    title: 'Peptidrop Documentation — Getting Started Guide',
    description: 'Learn how to use Peptidrop\'s AI peptide intelligence platform. Complete guides for the peptide database, protocol generator, and more.',
    url: 'https://peptidrop.me/docs',
  },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
