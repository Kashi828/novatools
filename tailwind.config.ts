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
        // "primary" now carries the gold accent throughout the whole site — every
        // bg-primary-*, text-primary-*, border-primary-*, accent-primary-* class in
        // every one of the 61 tool components picks this up automatically.
        primary: {
          DEFAULT: '#C9A961',
          50: '#FAF6EC',
          100: '#F3E9CE',
          400: '#D4BB7C',
          500: '#C9A961',
          600: '#B08D45',
          700: '#8C6F37',
        },
        secondary: {
          DEFAULT: '#A97142',
          400: '#C08B5C',
          500: '#A97142',
          600: '#8C5A34',
        },
        accent: {
          DEFAULT: '#6B7280',
          400: '#9CA3AF',
          500: '#6B7280',
        },
        success: '#22C55E',
        warning: '#B08D45',
        danger: '#B04545',
        bg: {
          light: '#FAF9F6',
          dark: '#0A0A0B',
        },
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #D4BB7C 0%, #C9A961 50%, #A97142 100%)',
        'gradient-radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(201,169,97,0.12), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(201,169,97,0.35)',
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
