// app/blog/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Peptide Research Blog - Guides, Protocols & Science | Peptidrop',
  description: 'Read in-depth peptide research articles, guides, and protocols. Topics include BPC-157, TB-500, GHK-Cu, Semaglutide, growth hormone peptides, longevity, cognitive enhancement, and more. Written by the Peptidrop research team.',
  alternates: { canonical: 'https://peptidrop.me/blog' },
  openGraph: {
    title: 'Peptide Research Blog - Guides, Protocols & Science | Peptidrop',
    description: 'In-depth peptide research articles covering 345+ peptides. Mechanisms, protocols, stacking guides, and safety information.',
    url: 'https://peptidrop.me/blog',
    type: 'website',
    images: [{ url: 'https://peptidrop.me/og-image.svg', width: 1200, height: 630 }],
  },
}

const categoryColors: Record<string, string> = {
  'Fundamentals': 'bg-accent-cyan/15 text-accent-cyan',
  'Peptide Guides': 'bg-accent-violet/15 text-accent-violet',
  'Anti-Aging': 'bg-accent-emerald/15 text-accent-emerald',
  'Growth Hormone': 'bg-accent-amber/15 text-accent-amber',
  'Weight Loss': 'bg-accent-rose/15 text-accent-rose',
  'Longevity': 'bg-accent-emerald/15 text-accent-emerald',
  'Protocols': 'bg-accent-cyan/15 text-accent-cyan',
  'Cognitive': 'bg-accent-violet/15 text-accent-violet',
  'Safety': 'bg-accent-rose/15 text-accent-rose',
  'Muscle Growth': 'bg-accent-amber/15 text-accent-amber',
  'Sleep': 'bg-accent-violet/15 text-accent-violet',
  'Immune': 'bg-accent-emerald/15 text-accent-emerald',
  'Education': 'bg-accent-cyan/15 text-accent-cyan',
  'Healing': 'bg-accent-emerald/15 text-accent-emerald',
  'Skin & Hair': 'bg-accent-rose/15 text-accent-rose',
  'Gut Health': 'bg-accent-emerald/15 text-accent-emerald',
  'Industry': 'bg-accent-amber/15 text-accent-amber',
}

export default function BlogPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Peptidrop Research Blog',
    description: 'In-depth peptide research articles, guides, protocols, and science.',
    url: 'https://peptidrop.me/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Peptidrop',
      url: 'https://peptidrop.me',
    },
    blogPost: blogPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `https://peptidrop.me/blog/${post.slug}`,
      author: { '@type': 'Organization', name: 'Peptidrop Research Team' },
    })),
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
            Read <span className="text-gradient">This</span>
          </h1>
          <p className="text-text-secondary max-w-2xl text-sm sm:text-base">
            In-depth peptide research articles, protocol guides, and the science behind 345+ peptides.
            Written by the Peptidrop research team for researchers, biohackers, and clinicians.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="glass-panel p-6 card-hover group block">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] sm:text-xs font-mono px-2 py-1 rounded ${categoryColors[post.category] || 'bg-surface-tertiary text-text-muted'}`}>
                  {post.category}
                </span>
                <span className="text-[10px] sm:text-xs text-text-muted">{post.readTime}</span>
              </div>
              <h2 className="font-display font-semibold text-sm sm:text-base mb-2 group-hover:text-accent-cyan transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-4 text-xs text-text-muted">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
