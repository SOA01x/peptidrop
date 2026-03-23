// components/layout/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { DropletLogo } from '@/components/ui/Logo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/peptides', label: 'Peptides' },
  { href: '/generator', label: 'AI Generator' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pricing', label: 'Pricing' },
]

function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('peptidrop-theme')
    if (saved === 'light') {
      setDark(false)
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      localStorage.setItem('peptidrop-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('peptidrop-theme', 'light')
    }
  }

  return (
    <button onClick={toggle}
      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
      aria-label="Toggle theme">
      {dark ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, plan } = useAppStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'bg-surface/80 backdrop-blur-xl border-b border-surface-border/50' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <DropletLogo size="sm" className="sm:hidden" />
          <DropletLogo size="md" className="hidden sm:block" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight">
            Pepti<span className="text-gradient">drop</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.href ? 'text-accent-cyan bg-accent-cyan/10' : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              )}>{link.label}</Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {plan === 'pro' ? (
                <div className="flex items-center gap-2 px-4 py-2 glass-panel-light">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                  <span className="text-sm font-display font-semibold text-accent-cyan">PRO</span>
                </div>
              ) : (
                <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 glass-panel-light hover:border-accent-cyan/30 transition-colors">
                  <span className="text-xs text-text-muted">Free</span>
                  <span className="text-xs text-accent-cyan">Upgrade</span>
                </Link>
              )}
              <Link href="/profile" className="btn-secondary text-sm !py-2">Profile</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors py-2 px-3">Sign In</Link>
              <Link href="/signup" className="btn-primary text-sm !py-2">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex lg:hidden items-center gap-1">
          <ThemeToggle />
          {user ? (
            plan === 'pro' ? (
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 glass-panel-light rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-xs font-display font-semibold text-accent-cyan">PRO</span>
              </Link>
            ) : (
              <Link href="/pricing" className="text-xs text-accent-cyan px-2 py-1">Upgrade</Link>
            )
          ) : (
            <Link href="/signup" className="btn-primary text-xs !py-2 !px-4">Sign Up</Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-text-secondary min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Menu">
            <div className="space-y-1.5 w-5">
              <div className={cn('w-full h-0.5 bg-current transition-all duration-300', mobileOpen && 'rotate-45 translate-y-[4px]')} />
              <div className={cn('w-full h-0.5 bg-current transition-all duration-300', mobileOpen && 'opacity-0')} />
              <div className={cn('w-full h-0.5 bg-current transition-all duration-300', mobileOpen && '-rotate-45 -translate-y-[4px]')} />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[56px] bg-surface/98 backdrop-blur-xl z-40 overflow-y-auto safe-bottom">
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={cn('block px-4 py-4 rounded-xl text-base font-medium transition-colors',
                  pathname === link.href ? 'text-accent-cyan bg-accent-cyan/10' : 'text-text-secondary active:bg-surface-secondary'
                )}>{link.label}</Link>
            ))}
            <div className="pt-4 mt-4 border-t border-surface-border/30 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 glass-panel">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                    <span className="text-sm font-display font-semibold text-accent-cyan">{plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>
                  </div>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-4 rounded-xl text-base font-medium text-text-secondary active:bg-surface-secondary">Profile</Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-4 rounded-xl text-base font-medium text-text-secondary border border-surface-border">Sign In</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-accent-cyan to-accent-violet text-surface">Get Started — Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
