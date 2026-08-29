'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { derivePrimaryRamp, deriveSecondaryRamp, deriveAccentRamp } from '@/lib/color-utils';

type Theme = 'light' | 'dark';
export type ColorTheme = 'gold' | 'emerald' | 'sapphire' | 'rose' | 'monochrome' | 'custom';
export type FontPairing = 'elegant' | 'modern' | 'classic' | 'rounded';
export type RadiusStyle = 'sharp' | 'rounded' | 'pill';

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;
  customColors: CustomColors;
  setCustomColors: (c: CustomColors) => void;
  fontPairing: FontPairing;
  setFontPairing: (f: FontPairing) => void;
  radiusStyle: RadiusStyle;
  setRadiusStyle: (r: RadiusStyle) => void;
}

const DEFAULT_CUSTOM: CustomColors = { primary: '#C9A961', secondary: '#A97142', accent: '#6B7280' };

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyCustomColors(colors: CustomColors) {
  const root = document.documentElement;
  const primary = derivePrimaryRamp(colors.primary);
  const secondary = deriveSecondaryRamp(colors.secondary);
  const accent = deriveAccentRamp(colors.accent);

  root.style.setProperty('--color-primary-50', primary[50]);
  root.style.setProperty('--color-primary-100', primary[100]);
  root.style.setProperty('--color-primary-400', primary[400]);
  root.style.setProperty('--color-primary-500', primary[500]);
  root.style.setProperty('--color-primary-600', primary[600]);
  root.style.setProperty('--color-primary-700', primary[700]);
  root.style.setProperty('--color-secondary-400', secondary[400]);
  root.style.setProperty('--color-secondary-500', secondary[500]);
  root.style.setProperty('--color-secondary-600', secondary[600]);
  root.style.setProperty('--color-accent-400', accent[400]);
  root.style.setProperty('--color-accent-500', accent[500]);
  root.style.setProperty('--color-grad-1', primary[400]);
  root.style.setProperty('--color-grad-2', primary[500]);
  root.style.setProperty('--color-grad-3', secondary[500]);
  root.style.setProperty('--color-glow', primary[500]);
  root.style.setProperty('--logo-grad-1', colors.primary);
  root.style.setProperty('--logo-grad-2', colors.primary);
  root.style.setProperty('--logo-grad-3', colors.secondary);
}

function clearCustomColors() {
  const root = document.documentElement;
  [
    '--color-primary-50', '--color-primary-100', '--color-primary-400', '--color-primary-500',
    '--color-primary-600', '--color-primary-700', '--color-secondary-400', '--color-secondary-500',
    '--color-secondary-600', '--color-accent-400', '--color-accent-500', '--color-grad-1',
    '--color-grad-2', '--color-grad-3', '--color-glow', '--logo-grad-1', '--logo-grad-2', '--logo-grad-3',
  ].forEach((prop) => root.style.removeProperty(prop));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('gold');
  const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_CUSTOM);
  const [fontPairing, setFontPairingState] = useState<FontPairing>('elegant');
  const [radiusStyle, setRadiusStyleState] = useState<RadiusStyle>('rounded');

  useEffect(() => {
    const storedFont = window.localStorage.getItem('novatools-font') as FontPairing | null;
    if (storedFont) setFontPairingState(storedFont);
    const storedRadius = window.localStorage.getItem('novatools-radius') as RadiusStyle | null;
    if (storedRadius) setRadiusStyleState(storedRadius);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-font', fontPairing);
    window.localStorage.setItem('novatools-font', fontPairing);
  }, [fontPairing]);

  useEffect(() => {
    document.documentElement.setAttribute('data-radius', radiusStyle);
    window.localStorage.setItem('novatools-radius', radiusStyle);
  }, [radiusStyle]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('novatools-theme') as Theme | null;
    const preferred = storedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(preferred);

    const storedColor = window.localStorage.getItem('novatools-color-theme') as ColorTheme | null;
    if (storedColor) setColorThemeState(storedColor);

    const storedCustom = window.localStorage.getItem('novatools-custom-colors');
    if (storedCustom) {
      try {
        setCustomColorsState(JSON.parse(storedCustom));
      } catch {
        // Ignore malformed stored data.
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('novatools-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme === 'custom' ? 'gold' : colorTheme);
    window.localStorage.setItem('novatools-color-theme', colorTheme);
    if (colorTheme === 'custom') {
      applyCustomColors(customColors);
    } else {
      clearCustomColors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorTheme]);

  function setColorTheme(t: ColorTheme) {
    setColorThemeState(t);
  }

  function setCustomColors(c: CustomColors) {
    setCustomColorsState(c);
    window.localStorage.setItem('novatools-custom-colors', JSON.stringify(c));
    if (colorTheme === 'custom') applyCustomColors(c);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
        colorTheme,
        setColorTheme,
        customColors,
        setCustomColors,
        fontPairing,
        setFontPairing: setFontPairingState,
        radiusStyle,
        setRadiusStyle: setRadiusStyleState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
