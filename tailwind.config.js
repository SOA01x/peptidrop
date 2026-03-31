/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: withOpacity('--c-surface'),
          secondary: withOpacity('--c-surface-sec'),
          tertiary: withOpacity('--c-surface-ter'),
          border: withOpacity('--c-border'),
        },
        text: {
          primary: withOpacity('--c-text'),
          secondary: withOpacity('--c-text-sec'),
          muted: withOpacity('--c-text-mut'),
        },
        accent: {
          cyan: '#e8c547',
          violet: '#e8c547',
          emerald: '#4ade80',
          amber: '#e8c547',
          rose: '#ef4444',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { card: '16px' },
      boxShadow: {
        glow: '0 0 40px -10px rgba(232, 197, 71, 0.3)',
        'glow-violet': '0 0 40px -10px rgba(232, 197, 71, 0.3)',
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 40px -4px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(232, 197, 71, 0.2)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(232, 197, 71, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
