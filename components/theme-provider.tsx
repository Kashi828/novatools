'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { derivePrimaryRamp, deriveSecondaryRamp, deriveAccentRamp, normalizeHex } from '@/lib/color-utils';

type Theme = 'light' | 'dark';
export type ColorTheme = 'gold' | 'emerald' | 'sapphire' | 'rose' | 'monochrome' | 'custom';
export type FontPairing = 'elegant' | 'modern' | 'classic' | 'rounded';
export type RadiusStyle = 'sharp' | 'rounded' | 'pill';
export type UiScale = 'compact' | 'comfortable' | 'large';
export type MotionPreference = 'full' | 'reduced';
export type ContrastPreference = 'standard' | 'high';
export type SurfaceStyle = 'clean' | 'textured';
export type CardDensity = 'relaxed' | 'dense';

export interface CustomColors { primary: string; secondary: string; accent: string; }
export const DEFAULT_CUSTOM_COLORS: CustomColors = { primary: '#C9A961', secondary: '#A97142', accent: '#6B7280' };

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  resetPreferences: () => void;
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
  contrastPreference: ContrastPreference;
  setContrastPreference: (preference: ContrastPreference) => void;
  surfaceStyle: SurfaceStyle;
  setSurfaceStyle: (style: SurfaceStyle) => void;
  cardDensity: CardDensity;
  setCardDensity: (density: CardDensity) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const COLOR_THEMES = ['gold', 'emerald', 'sapphire', 'rose', 'monochrome', 'custom'] as const;
const FONT_PAIRINGS = ['elegant', 'modern', 'classic', 'rounded'] as const;
const RADIUS_STYLES = ['sharp', 'rounded', 'pill'] as const;
const UI_SCALES = ['compact', 'comfortable', 'large'] as const;
const MOTION_PREFERENCES = ['full', 'reduced'] as const;
const CONTRAST_PREFERENCES = ['standard', 'high'] as const;
const SURFACE_STYLES = ['clean', 'textured'] as const;
const CARD_DENSITIES = ['relaxed', 'dense'] as const;

const PALETTE_VARS = [
  '--color-primary-50','--color-primary-100','--color-primary-400','--color-primary-500','--color-primary-600','--color-primary-700',
  '--color-secondary-400','--color-secondary-500','--color-secondary-600','--color-accent-400','--color-accent-500',
  '--color-grad-1','--color-grad-2','--color-grad-3','--color-glow','--logo-grad-1','--logo-grad-2','--logo-grad-3',
] as const;
const PALETTE_DURATION = 280;
let paletteAnimationFrame: number | null = null;
let paletteAnimationToken = 0;

function writeStored(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* storage can be unavailable */ }
}
function writeCookie(key: string, value: string) {
  try { document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`; } catch { /* cookie access can be unavailable */ }
}
function readStored<T>(key: string, fallback: T, allowed?: readonly T[]): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    if (!allowed || allowed.includes(value as T)) return value as T;
  } catch { /* use fallback */ }
  return fallback;
}
function sanitizeCustomColors(colors: Partial<CustomColors>, fallback: CustomColors = DEFAULT_CUSTOM_COLORS): CustomColors {
  return {
    primary: normalizeHex(colors.primary ?? '') ?? fallback.primary,
    secondary: normalizeHex(colors.secondary ?? '') ?? fallback.secondary,
    accent: normalizeHex(colors.accent ?? '') ?? fallback.accent,
  };
}
function readStoredCustomColors(): CustomColors {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_COLORS;
  try {
    const value = window.localStorage.getItem('novatools-custom-colors');
    if (!value) return DEFAULT_CUSTOM_COLORS;
    const parsed = JSON.parse(value) as Partial<CustomColors>;
    return sanitizeCustomColors(parsed);
  } catch {
    return DEFAULT_CUSTOM_COLORS;
  }
}
function applyCustomColors(colors: CustomColors) {
  const safe = sanitizeCustomColors(colors);
  const root = document.documentElement;
  const primary = derivePrimaryRamp(safe.primary);
  const secondary = deriveSecondaryRamp(safe.secondary);
  const accent = deriveAccentRamp(safe.accent);
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
  root.style.setProperty('--logo-grad-1', primary[400]);
  root.style.setProperty('--logo-grad-2', primary[500]);
  root.style.setProperty('--logo-grad-3', secondary[500]);
}
function clearCustomColors() {
  const root = document.documentElement;
  PALETTE_VARS.forEach((prop) => root.style.removeProperty(prop));
}
function parseColor(value: string): [number, number, number] | null {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) return [parseInt(hex[1].slice(0, 2), 16), parseInt(hex[1].slice(2, 4), 16), parseInt(hex[1].slice(4, 6), 16)];
  const numbers = value.match(/\d+(?:\.\d+)?/g);
  if (numbers && numbers.length >= 3) {
    const rgb = [Number(numbers[0]), Number(numbers[1]), Number(numbers[2])];
    if (rgb.every((channel) => Number.isFinite(channel) && channel >= 0 && channel <= 255)) return rgb as [number, number, number];
  }
  return null;
}
function colorString(rgb: [number, number, number]) { return `${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])}`; }
function capturePalette() {
  const styles = getComputedStyle(document.documentElement);
  return Object.fromEntries(PALETTE_VARS.map((name) => [name, styles.getPropertyValue(name).trim()])) as Record<(typeof PALETTE_VARS)[number], string>;
}
function cancelPaletteAnimation() {
  paletteAnimationToken += 1;
  if (paletteAnimationFrame !== null) {
    window.cancelAnimationFrame(paletteAnimationFrame);
    paletteAnimationFrame = null;
  }
}
function animatePalette(applyTarget: () => void, keepInline: boolean) {
  if (typeof window === 'undefined') { applyTarget(); return; }
  cancelPaletteAnimation();
  const token = paletteAnimationToken;
  const root = document.documentElement;
  const reduced = root.dataset.motion === 'reduced' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { applyTarget(); return; }

  const from = capturePalette();
  applyTarget();
  const to = capturePalette();
  const start = performance.now();
  PALETTE_VARS.forEach((name) => root.style.setProperty(name, from[name]));

  const tick = (now: number) => {
    if (token !== paletteAnimationToken) return;
    const progress = Math.min(1, (now - start) / PALETTE_DURATION);
    const eased = 1 - Math.pow(1 - progress, 3);
    PALETTE_VARS.forEach((name) => {
      const a = parseColor(from[name]);
      const b = parseColor(to[name]);
      if (!a || !b) return;
      root.style.setProperty(name, colorString([
        a[0] + (b[0] - a[0]) * eased,
        a[1] + (b[1] - a[1]) * eased,
        a[2] + (b[2] - a[2]) * eased,
      ]));
    });
    if (progress < 1 && root.dataset.motion !== 'reduced' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      paletteAnimationFrame = window.requestAnimationFrame(tick);
      return;
    }
    paletteAnimationFrame = null;
    if (token !== paletteAnimationToken) return;
    if (keepInline) PALETTE_VARS.forEach((name) => root.style.setProperty(name, to[name]));
    else clearCustomColors();
  };
  paletteAnimationFrame = window.requestAnimationFrame(tick);
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
  const [contrastPreference, setContrastPreferenceState] = useState<ContrastPreference>('standard');
  const [surfaceStyle, setSurfaceStyleState] = useState<SurfaceStyle>('clean');
  const [cardDensity, setCardDensityState] = useState<CardDensity>('relaxed');

  useEffect(() => {
    const html = document.documentElement;
    const storedTheme = readStored<Theme>('novatools-theme', html.classList.contains('dark') ? 'dark' : 'light', ['light', 'dark']);
    const storedColor = readStored<ColorTheme>('novatools-color-theme', 'gold', COLOR_THEMES);
    const storedFont = readStored<FontPairing>('novatools-font', 'elegant', FONT_PAIRINGS);
    const storedRadius = readStored<RadiusStyle>('novatools-radius', 'rounded', RADIUS_STYLES);
    const storedScale = readStored<UiScale>('novatools-ui-scale', 'comfortable', UI_SCALES);
    const storedMotion = readStored<MotionPreference>('novatools-motion', 'full', MOTION_PREFERENCES);
    const storedContrast = readStored<ContrastPreference>('novatools-contrast', 'standard', CONTRAST_PREFERENCES);
    const storedSurface = readStored<SurfaceStyle>('novatools-surface', 'clean', SURFACE_STYLES);
    const storedDensity = readStored<CardDensity>('novatools-card-density', 'relaxed', CARD_DENSITIES);
    const storedCustom = readStoredCustomColors();

    setTheme(storedTheme);
    setColorThemeState(storedColor);
    setFontPairingState(storedFont);
    setRadiusStyleState(storedRadius);
    setUiScaleState(storedScale);
    setMotionPreferenceState(storedMotion);
    setContrastPreferenceState(storedContrast);
    setSurfaceStyleState(storedSurface);
    setCardDensityState(storedDensity);
    setCustomColorsState(storedCustom);

    html.classList.toggle('dark', storedTheme === 'dark');
    html.setAttribute('data-theme', storedColor === 'custom' ? 'gold' : storedColor);
    html.setAttribute('data-font', storedFont);
    html.setAttribute('data-radius', storedRadius);
    html.setAttribute('data-ui-scale', storedScale);
    html.setAttribute('data-motion', storedMotion);
    html.setAttribute('data-contrast', storedContrast);
    html.setAttribute('data-surface', storedSurface);
    html.setAttribute('data-card-density', storedDensity);
    if (storedColor === 'custom') applyCustomColors(storedCustom); else clearCustomColors();

    writeStored('novatools-theme', storedTheme);
    writeStored('novatools-color-theme', storedColor);
    writeStored('novatools-custom-colors', JSON.stringify(storedCustom));
    writeCookie('novatools-theme', storedTheme);
    writeCookie('novatools-color-theme', storedColor);
    writeCookie('novatools-custom-colors', JSON.stringify(storedCustom));
    setReady(true);
  }, []);

  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-font', fontPairing); writeStored('novatools-font', fontPairing); writeCookie('novatools-font', fontPairing); }, [fontPairing, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-radius', radiusStyle); writeStored('novatools-radius', radiusStyle); writeCookie('novatools-radius', radiusStyle); }, [radiusStyle, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-ui-scale', uiScale); writeStored('novatools-ui-scale', uiScale); writeCookie('novatools-ui-scale', uiScale); }, [uiScale, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-motion', motionPreference); writeStored('novatools-motion', motionPreference); writeCookie('novatools-motion', motionPreference); if (motionPreference === 'reduced') cancelPaletteAnimation(); }, [motionPreference, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-contrast', contrastPreference); writeStored('novatools-contrast', contrastPreference); writeCookie('novatools-contrast', contrastPreference); }, [contrastPreference, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-surface', surfaceStyle); writeStored('novatools-surface', surfaceStyle); writeCookie('novatools-surface', surfaceStyle); }, [surfaceStyle, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-card-density', cardDensity); writeStored('novatools-card-density', cardDensity); writeCookie('novatools-card-density', cardDensity); }, [cardDensity, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.classList.toggle('dark', theme === 'dark'); writeStored('novatools-theme', theme); writeCookie('novatools-theme', theme); }, [theme, ready]);
  useEffect(() => { if (!ready) return; writeStored('novatools-color-theme', colorTheme); writeCookie('novatools-color-theme', colorTheme); writeStored('novatools-custom-colors', JSON.stringify(customColors)); writeCookie('novatools-custom-colors', JSON.stringify(customColors)); }, [colorTheme, customColors, ready]);
  useEffect(() => () => cancelPaletteAnimation(), []);

  function setColorTheme(t: ColorTheme) {
    const next = COLOR_THEMES.includes(t) ? t : 'gold';
    animatePalette(() => {
      document.documentElement.setAttribute('data-theme', next === 'custom' ? 'gold' : next);
      if (next === 'custom') applyCustomColors(customColors); else clearCustomColors();
    }, next === 'custom');
    setColorThemeState(next);
  }

  function setCustomColors(colors: CustomColors) {
    const safe = sanitizeCustomColors(colors, customColors);
    if (colorTheme === 'custom') animatePalette(() => applyCustomColors(safe), true);
    setCustomColorsState(safe);
  }

  function setMotionPreference(preference: MotionPreference) {
    setMotionPreferenceState(preference);
    if (preference === 'reduced') cancelPaletteAnimation();
  }

  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }

  function resetPreferences() {
    cancelPaletteAnimation();
    const html = document.documentElement;
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'gold');
    html.setAttribute('data-font', 'elegant');
    html.setAttribute('data-radius', 'rounded');
    html.setAttribute('data-ui-scale', 'comfortable');
    html.setAttribute('data-motion', 'full');
    html.setAttribute('data-contrast', 'standard');
    html.setAttribute('data-surface', 'clean');
    html.setAttribute('data-card-density', 'relaxed');
    clearCustomColors();
    setTheme('light');
    setColorThemeState('gold');
    setCustomColorsState(DEFAULT_CUSTOM_COLORS);
    setFontPairingState('elegant');
    setRadiusStyleState('rounded');
    setUiScaleState('comfortable');
    setMotionPreferenceState('full');
    setContrastPreferenceState('standard');
    setSurfaceStyleState('clean');
    setCardDensityState('relaxed');
  }

  if (!ready) return null;
  return <ThemeContext.Provider value={{
    theme, toggleTheme, resetPreferences,
    colorTheme, setColorTheme,
    customColors, setCustomColors,
    fontPairing, setFontPairing: setFontPairingState,
    radiusStyle, setRadiusStyle: setRadiusStyleState,
    uiScale, setUiScale: setUiScaleState,
    motionPreference, setMotionPreference,
    contrastPreference, setContrastPreference: setContrastPreferenceState,
    surfaceStyle, setSurfaceStyle: setSurfaceStyleState,
    cardDensity, setCardDensity: setCardDensityState,
  }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
