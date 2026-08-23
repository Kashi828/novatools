import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          50: '#EEF0FF',
          100: '#E0E4FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F52D6',
          700: '#3F42AD',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        accent: {
          DEFAULT: '#06B6D4',
          400: '#22D3EE',
          500: '#06B6D4',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        gold: {
          DEFAULT: '#D4AF37',
          400: '#E9C766',
          500: '#D4AF37',
          600: '#B8912A',
        },
        bg: {
          light: '#FFFFFF',
          dark: '#050609',
        },
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #06B6D4 100%)',
        'gradient-premium': 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 45%, #D4AF37 100%)',
        'gradient-radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.25), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(99,102,241,0.45)',
        'glow-gold': '0 0 40px -8px rgba(212,175,55,0.5)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [typography],
};

export default config;
