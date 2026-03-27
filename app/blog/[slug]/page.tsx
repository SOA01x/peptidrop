// app/blog/[slug]/page.tsx
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://peptidrop.me/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://peptidrop.me/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Peptidrop Research Team'],
      images: [{ url: 'https://peptidrop.me/og-image.svg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['https://peptidrop.me/og-image.svg'],
    },
  }
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-display font-bold text-xl sm:text-2xl mt-10 mb-4 text-text-primary">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-display font-semibold text-lg sm:text-xl mt-8 mb-3 text-text-primary">
          {line.replace('### ', '')}
        </h3>
      )
    } else if (line.startsWith('- **') || line.startsWith('- ')) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].replace('- ', ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4 ml-4">
          {listItems.map((item, j) => (
            <li key={j} className="text-sm sm:text-base text-text-secondary leading-relaxed flex gap-2">
              <span className="text-accent-cyan mt-1.5 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split('|').filter(Boolean).map(s => s.trim())
        const rows = tableLines.slice(2).map(row => row.split('|').filter(Boolean).map(s => s.trim()))
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  {headers.map((h, j) => (
                    <th key={j} className="text-left py-3 px-4 font-display font-semibold text-text-primary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j} className="border-b border-surface-border/30">
                    {row.map((cell, k) => (
                      <td key={k} className="py-3 px-4 text-text-secondary">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }
    } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-4 ml-4 list-decimal list-inside">
          {listItems.map((item, j) => (
            <li key={j} className="text-sm sm:text-base text-text-secondary leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      )
      continue
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="text-sm sm:text-base text-text-secondary leading-relaxed my-4"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      )
    }

    i++
  }

  return elements
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) notFound()

  const postIndex = blogPosts.findIndex(p => p.slug === params.slug)
  const relatedPosts = blogPosts.filter((_, i) => i !== postIndex).slice(0, 3)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Peptidrop Research Team' },
    publisher: {
      '@type': 'Organization',
      name: 'Peptidrop',
      url: 'https://peptidrop.me',
    },
    mainEntityOfPage: `https://peptidrop.me/blog/${post.slug}`,
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <article className="pt-24 sm:pt-28 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="text-sm text-text-muted hover:text-accent-cyan transition-colors mb-6 inline-block">
          ← Back to all articles
        </Link>

        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">{post.category}</span>
            <span className="text-xs text-text-muted">{post.readTime} read</span>
            <span className="text-xs text-text-muted">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div className="border-t border-surface-border/30 pt-8">
          {renderContent(post.content)}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-border/30">
          <div className="glass-panel p-6 sm:p-8 text-center">
            <h3 className="font-display font-bold text-lg mb-2">Explore Peptides on Peptidrop</h3>
            <p className="text-text-muted text-sm mb-4">Browse 345+ peptides with AI-powered protocol generation, synergy mapping, and risk simulation.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/peptides" className="btn-primary text-sm">Browse Database</Link>
              <Link href="/generator" className="btn-secondary text-sm">Generate Protocol</Link>
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-surface-border/30">
            <h3 className="font-display font-bold text-lg mb-6">More Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`}
                  className="glass-panel p-4 card-hover group block">
                  <span className="text-[10px] font-mono text-accent-cyan">{related.category}</span>
                  <h4 className="font-display font-semibold text-sm mt-1 group-hover:text-accent-cyan transition-colors leading-tight">
                    {related.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  )
}
