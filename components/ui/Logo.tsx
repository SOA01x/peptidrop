// components/ui/Logo.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function DropletLogo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className={cn('relative flex-shrink-0', sizes[size], className)}>
      <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Outer dotted circle */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="#e8c547" strokeWidth="4" strokeDasharray="8 8" />
        {/* Middle solid circle ring */}
        <circle cx="100" cy="100" r="58" fill="none" stroke="#e8c547" strokeWidth="10" />
        {/* Center dot */}
        <circle cx="100" cy="100" r="12" fill="#e8c547" />
      </svg>
    </div>
  )
}

export function LogoWithText({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
      <DropletLogo size={size} />
      <span className={cn('font-display font-bold tracking-tight', textSizes[size])}>
        Pepti<span className="text-gradient">drop</span>
      </span>
    </Link>
  )
}
