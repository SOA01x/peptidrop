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
        {/* Outer ring of dots */}
        <g fill="#00E5FF">
          <circle cx="100" cy="12" r="8"/>
          <circle cx="119.6" cy="13.5" r="7.5"/>
          <circle cx="138" cy="18.5" r="7.5"/>
          <circle cx="154.5" cy="27" r="7"/>
          <circle cx="168.5" cy="38.5" r="7"/>
          <circle cx="179" cy="52.5" r="7"/>
          <circle cx="186.5" cy="68.5" r="7"/>
          <circle cx="190" cy="86" r="7.5"/>
          <circle cx="189.5" cy="104" r="7.5"/>
          <circle cx="185" cy="121.5" r="7.5"/>
          <circle cx="177" cy="137.5" r="7.5"/>
          <circle cx="166" cy="151.5" r="7.5"/>
          <circle cx="152.5" cy="163" r="7.5"/>
          <circle cx="137" cy="171.5" r="7.5"/>
          <circle cx="120" cy="177" r="8"/>
          <circle cx="100" cy="179" r="8.5"/>
          <circle cx="80" cy="177" r="8"/>
          <circle cx="63" cy="171.5" r="7.5"/>
          <circle cx="47.5" cy="163" r="7.5"/>
          <circle cx="34" cy="151.5" r="7.5"/>
          <circle cx="23" cy="137.5" r="7.5"/>
          <circle cx="15" cy="121.5" r="7.5"/>
          <circle cx="10.5" cy="104" r="7.5"/>
          <circle cx="10" cy="86" r="7.5"/>
          <circle cx="13.5" cy="68.5" r="7"/>
          <circle cx="21" cy="52.5" r="7"/>
          <circle cx="31.5" cy="38.5" r="7"/>
          <circle cx="45.5" cy="27" r="7"/>
          <circle cx="62" cy="18.5" r="7.5"/>
          <circle cx="80.4" cy="13.5" r="7.5"/>
        </g>
        {/* Middle solid circle ring */}
        <circle cx="100" cy="100" r="52" fill="none" stroke="#00E5FF" strokeWidth="12"/>
        {/* Center dot */}
        <circle cx="100" cy="100" r="6" fill="#00E5FF"/>
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
