/** @type {import('tailwindcss').Config} */
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
          DEFAULT: '#0A0A0F',
          secondary: '#12121A',
          tertiary: '#1A1A28',
          border: '#2A2A3A',
        },
        accent: {
          cyan: '#00E5FF',
          violet: '#7A5CFF',
          emerald: '#00D68F',
          amber: '#FFB800',
          rose: '#FF4D6A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(0, 229, 255, 0.3)',
        'glow-violet': '0 0 40px -10px rgba(122, 92, 255, 0.3)',
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 40px -4px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #0A0A0F 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(0, 229, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(0, 229, 255, 0.4)' },
        }
      },
    },
  },
  plugins: [],
}
