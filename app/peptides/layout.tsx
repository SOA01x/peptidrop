import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peptide Database - Explore 345+ Peptides | BPC-157, TB-500, GHK-Cu & More',
  description: 'Browse the most comprehensive peptide database with 345+ compounds. Detailed profiles for BPC-157, TB-500, GHK-Cu, CJC-1295, Ipamorelin, Semaglutide, Epithalon, Selank, and hundreds more. Includes mechanisms, receptors, pathways, evidence levels, and risk profiles.',
  alternates: {
    canonical: 'https://peptidrop.me/peptides',
  },
  openGraph: {
    title: 'Peptide Database - 345+ Peptides with Mechanisms & Evidence',
    description: 'The largest curated peptide research database. Explore detailed profiles for 345+ peptides including mechanisms of action, receptor targets, synergies, and safety data.',
    url: 'https://peptidrop.me/peptides',
  },
}

export default function PeptidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
