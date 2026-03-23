// components/layout/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/peptides', label: 'Peptides' },
  { href: '/generator', label: 'AI Generator' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { credits, user } = useAppStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl border-b border-surface-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan to-accent-violet rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[2px] bg-surface rounded-[10px] flex items-center justify-center">
              <span className="text-accent-cyan font-display font-bold text-lg">P</span>
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Pepti<span className="text-gradient">drop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.href
                  ? 'text-accent-cyan bg-accent-cyan/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 glass-panel-light">
                <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                <span className="text-sm font-mono text-accent-cyan">{credits}</span>
                <span className="text-xs text-text-muted">credits</span>
              </div>
              <Link href="/profile" className="btn-secondary text-sm py-2">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary"
        >
          <div className="space-y-1.5">
            <div className={cn('w-6 h-0.5 bg-current transition-transform', mobileOpen && 'rotate-45 translate-y-2')} />
            <div className={cn('w-6 h-0.5 bg-current transition-opacity', mobileOpen && 'opacity-0')} />
            <div className={cn('w-6 h-0.5 bg-current transition-transform', mobileOpen && '-rotate-45 -translate-y-2')} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-secondary/95 backdrop-blur-xl border-b border-surface-border">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-accent-cyan bg-accent-cyan/10'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
