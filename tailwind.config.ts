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
        // Every shade reads from a CSS custom property so the 5 selectable color
        // themes (set via [data-theme] on <html>) reskin the whole site — including
        // all 60+ tool components — without editing them individually.
        primary: {
          DEFAULT: 'rgb(var(--color-primary-500) / <alpha-value>)',
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
          500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent-500) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
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
        heading: ['var(--font-heading-active)', 'serif'],
        body: ['var(--font-body-active)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, rgb(var(--color-grad-1)) 0%, rgb(var(--color-grad-2)) 50%, rgb(var(--color-grad-3)) 100%)',
        'gradient-premium':
          'linear-gradient(135deg, rgb(var(--color-primary-400)) 0%, rgb(var(--color-primary-600)) 55%, rgb(var(--color-secondary-600)) 100%)',
        'gradient-radial-glow':
          'radial-gradient(circle at 50% 0%, rgb(var(--color-glow) / 0.12), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgb(var(--color-glow) / 0.35)',
        'glow-gold': '0 2px 12px -2px rgb(var(--color-glow) / 0.55)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
      },
      // The whole radius scale reads from CSS variables so the "Corner style"
      // preference rescales every step proportionally. Each utility keeps its
      // relative size instead of being flattened to one blanket value, which is
      // what previously made text collide with over-rounded corners.
      borderRadius: {
        none: '0px',
        sm: 'var(--radius-sm, 0.125rem)',
        DEFAULT: 'var(--radius-base, 0.25rem)',
        md: 'var(--radius-md, 0.375rem)',
        lg: 'var(--radius-lg, 0.5rem)',
        xl: 'var(--radius-xl, 0.75rem)',
        '2xl': 'var(--radius-2xl, 1rem)',
        '3xl': 'var(--radius-3xl, 1.5rem)',
        xl2: 'var(--radius-xl2, 1.25rem)',
        full: '9999px',
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
