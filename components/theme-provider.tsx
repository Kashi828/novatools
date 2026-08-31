'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { derivePrimaryRamp, deriveSecondaryRamp, deriveAccentRamp } from '@/lib/color-utils';

type Theme = 'light' | 'dark';
export type ColorTheme = 'gold' | 'emerald' | 'sapphire' | 'rose' | 'monochrome' | 'custom';
export type FontPairing = 'elegant' | 'modern' | 'classic' | 'rounded';
export type RadiusStyle = 'sharp' | 'rounded' | 'pill';
export type UiScale = 'compact' | 'comfortable' | 'large';
export type MotionPreference = 'full' | 'reduced';

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = {
  primary: '#C9A961',
  secondary: '#A97142',
  accent: '#6B7280',
};

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
  uiScale: UiScale;
  setUiScale: (scale: UiScale) => void;
  motionPreference: MotionPreference;
  setMotionPreference: (preference: MotionPreference) => void;
}

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

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return value ? (value as T) : fallback;
}

function readStoredCustomColors(): CustomColors {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_COLORS;
  const value = window.localStorage.getItem('novatools-custom-colors');
  if (!value) return DEFAULT_CUSTOM_COLORS;
  try {
    const parsed = JSON.parse(value) as Partial<CustomColors>;
    if (typeof parsed.primary === 'string' && typeof parsed.secondary === 'string' && typeof parsed.accent === 'string') {
      return { primary: parsed.primary, secondary: parsed.secondary, accent: parsed.accent };
    }
  } catch {
    // Ignore malformed stored data.
  }
  return DEFAULT_CUSTOM_COLORS;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('gold');
  const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_CUSTOM_COLORS);
  const [fontPairing, setFontPairingState] = useState<FontPairing>('elegant');
  const [radiusStyle, setRadiusStyleState] = useState<RadiusStyle>('rounded');
  const [uiScale, setUiScaleState] = useState<UiScale>('comfortable');
  const [motionPreference, setMotionPreferenceState] = useState<MotionPreference>('full');

  // Restore every preference before any persistence effect is allowed to run.
  useEffect(() => {
    const storedTheme = readStored<Theme>('novatools-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const storedColor = readStored<ColorTheme>('novatools-color-theme', 'gold');
    const storedFont = readStored<FontPairing>('novatools-font', 'elegant');
    const storedRadius = readStored<RadiusStyle>('novatools-radius', 'rounded');
    const storedScale = readStored<UiScale>('novatools-ui-scale', 'comfortable');
    const storedMotion = readStored<MotionPreference>('novatools-motion', 'full');
    const storedCustom = readStoredCustomColors();

    setTheme(storedTheme);
    setColorThemeState(storedColor);
    setFontPairingState(storedFont);
    setRadiusStyleState(storedRadius);
    setUiScaleState(storedScale);
    setMotionPreferenceState(storedMotion);
    setCustomColorsState(storedCustom);

    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', storedColor === 'custom' ? 'gold' : storedColor);
    document.documentElement.setAttribute('data-font', storedFont);
    document.documentElement.setAttribute('data-radius', storedRadius);
    document.documentElement.setAttribute('data-ui-scale', storedScale);
    document.documentElement.setAttribute('data-motion', storedMotion);
    if (storedColor === 'custom') applyCustomColors(storedCustom);
    else clearCustomColors();

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-font', fontPairing);
    window.localStorage.setItem('novatools-font', fontPairing);
  }, [fontPairing, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-radius', radiusStyle);
    window.localStorage.setItem('novatools-radius', radiusStyle);
  }, [radiusStyle, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-ui-scale', uiScale);
    window.localStorage.setItem('novatools-ui-scale', uiScale);
  }, [uiScale, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-motion', motionPreference);
    window.localStorage.setItem('novatools-motion', motionPreference);
  }, [motionPreference, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('novatools-theme', theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-theme', colorTheme === 'custom' ? 'gold' : colorTheme);
    window.localStorage.setItem('novatools-color-theme', colorTheme);
    if (colorTheme === 'custom') applyCustomColors(customColors);
    else clearCustomColors();
  }, [colorTheme, customColors, ready]);

  function setColorTheme(t: ColorTheme) {
    window.localStorage.setItem('novatools-color-theme', t);
    document.documentElement.setAttribute('data-theme', t === 'custom' ? 'gold' : t);
    if (t === 'custom') applyCustomColors(customColors);
    else clearCustomColors();
    setColorThemeState(t);
  }

  function setCustomColors(c: CustomColors) {
    setCustomColorsState(c);
    window.localStorage.setItem('novatools-custom-colors', JSON.stringify(c));
    if (colorTheme === 'custom') applyCustomColors(c);
  }

  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      window.localStorage.setItem('novatools-theme', next);
      return next;
    });
  }

  if (!ready) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colorTheme,
        setColorTheme,
        customColors,
        setCustomColors,
        fontPairing,
        setFontPairing: setFontPairingState,
        radiusStyle,
        setRadiusStyle: setRadiusStyleState,
        uiScale,
        setUiScale: setUiScaleState,
        motionPreference,
        setMotionPreference: setMotionPreferenceState,
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
