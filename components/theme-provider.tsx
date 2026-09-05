'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { derivePrimaryRamp, deriveSecondaryRamp, deriveAccentRamp } from '@/lib/color-utils';

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
  theme: Theme; toggleTheme: () => void;
  colorTheme: ColorTheme; setColorTheme: (t: ColorTheme) => void;
  customColors: CustomColors; setCustomColors: (c: CustomColors) => void;
  fontPairing: FontPairing; setFontPairing: (f: FontPairing) => void;
  radiusStyle: RadiusStyle; setRadiusStyle: (r: RadiusStyle) => void;
  uiScale: UiScale; setUiScale: (scale: UiScale) => void;
  motionPreference: MotionPreference; setMotionPreference: (preference: MotionPreference) => void;
  contrastPreference: ContrastPreference; setContrastPreference: (preference: ContrastPreference) => void;
  surfaceStyle: SurfaceStyle; setSurfaceStyle: (style: SurfaceStyle) => void;
  cardDensity: CardDensity; setCardDensity: (density: CardDensity) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
function writeCookie(key: string, value: string) { document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`; }
function applyCustomColors(colors: CustomColors) {
  const root = document.documentElement; const primary = derivePrimaryRamp(colors.primary); const secondary = deriveSecondaryRamp(colors.secondary); const accent = deriveAccentRamp(colors.accent);
  root.style.setProperty('--color-primary-50', primary[50]); root.style.setProperty('--color-primary-100', primary[100]); root.style.setProperty('--color-primary-400', primary[400]); root.style.setProperty('--color-primary-500', primary[500]); root.style.setProperty('--color-primary-600', primary[600]); root.style.setProperty('--color-primary-700', primary[700]);
  root.style.setProperty('--color-secondary-400', secondary[400]); root.style.setProperty('--color-secondary-500', secondary[500]); root.style.setProperty('--color-secondary-600', secondary[600]); root.style.setProperty('--color-accent-400', accent[400]); root.style.setProperty('--color-accent-500', accent[500]);
  root.style.setProperty('--color-grad-1', primary[400]); root.style.setProperty('--color-grad-2', primary[500]); root.style.setProperty('--color-grad-3', secondary[500]); root.style.setProperty('--color-glow', primary[500]); root.style.setProperty('--logo-grad-1', colors.primary); root.style.setProperty('--logo-grad-2', colors.primary); root.style.setProperty('--logo-grad-3', colors.secondary);
}
function clearCustomColors() { const root = document.documentElement; ['--color-primary-50','--color-primary-100','--color-primary-400','--color-primary-500','--color-primary-600','--color-primary-700','--color-secondary-400','--color-secondary-500','--color-secondary-600','--color-accent-400','--color-accent-500','--color-grad-1','--color-grad-2','--color-grad-3','--color-glow','--logo-grad-1','--logo-grad-2','--logo-grad-3'].forEach((prop) => root.style.removeProperty(prop)); }
function readStored<T>(key: string, fallback: T): T { if (typeof window === 'undefined') return fallback; const value = window.localStorage.getItem(key); return value ? (value as T) : fallback; }
function readStoredCustomColors(): CustomColors { if (typeof window === 'undefined') return DEFAULT_CUSTOM_COLORS; const value = window.localStorage.getItem('novatools-custom-colors'); if (!value) return DEFAULT_CUSTOM_COLORS; try { const parsed = JSON.parse(value) as Partial<CustomColors>; if (typeof parsed.primary === 'string' && typeof parsed.secondary === 'string' && typeof parsed.accent === 'string') return { primary: parsed.primary, secondary: parsed.secondary, accent: parsed.accent }; } catch { /* ignore */ } return DEFAULT_CUSTOM_COLORS; }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false); const [theme, setTheme] = useState<Theme>('dark'); const [colorTheme, setColorThemeState] = useState<ColorTheme>('gold'); const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_CUSTOM_COLORS); const [fontPairing, setFontPairingState] = useState<FontPairing>('elegant'); const [radiusStyle, setRadiusStyleState] = useState<RadiusStyle>('rounded'); const [uiScale, setUiScaleState] = useState<UiScale>('comfortable'); const [motionPreference, setMotionPreferenceState] = useState<MotionPreference>('full'); const [contrastPreference, setContrastPreferenceState] = useState<ContrastPreference>('standard'); const [surfaceStyle, setSurfaceStyleState] = useState<SurfaceStyle>('clean'); const [cardDensity, setCardDensityState] = useState<CardDensity>('relaxed');
  useEffect(() => {
    const html = document.documentElement; const storedTheme = readStored<Theme>('novatools-theme', html.classList.contains('dark') ? 'dark' : 'light'); const storedColor = readStored<ColorTheme>('novatools-color-theme', (html.getAttribute('data-theme') as ColorTheme) || 'gold'); const storedFont = readStored<FontPairing>('novatools-font', 'elegant'); const storedRadius = readStored<RadiusStyle>('novatools-radius', 'rounded'); const storedScale = readStored<UiScale>('novatools-ui-scale', 'comfortable'); const storedMotion = readStored<MotionPreference>('novatools-motion', 'full'); const storedContrast = readStored<ContrastPreference>('novatools-contrast', 'standard'); const storedSurface = readStored<SurfaceStyle>('novatools-surface', 'clean'); const storedDensity = readStored<CardDensity>('novatools-card-density', 'relaxed'); const storedCustom = readStoredCustomColors();
    setTheme(storedTheme); setColorThemeState(storedColor); setFontPairingState(storedFont); setRadiusStyleState(storedRadius); setUiScaleState(storedScale); setMotionPreferenceState(storedMotion); setContrastPreferenceState(storedContrast); setSurfaceStyleState(storedSurface); setCardDensityState(storedDensity); setCustomColorsState(storedCustom);
    html.classList.toggle('dark', storedTheme === 'dark'); html.setAttribute('data-theme', storedColor === 'custom' ? 'gold' : storedColor); html.setAttribute('data-font', storedFont); html.setAttribute('data-radius', storedRadius); html.setAttribute('data-ui-scale', storedScale); html.setAttribute('data-motion', storedMotion); html.setAttribute('data-contrast', storedContrast); html.setAttribute('data-surface', storedSurface); html.setAttribute('data-card-density', storedDensity); if (storedColor === 'custom') applyCustomColors(storedCustom); else clearCustomColors(); writeCookie('novatools-theme', storedTheme); writeCookie('novatools-color-theme', storedColor); writeCookie('novatools-custom-colors', JSON.stringify(storedCustom)); setReady(true);
  }, []);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-font', fontPairing); localStorage.setItem('novatools-font', fontPairing); writeCookie('novatools-font', fontPairing); }, [fontPairing, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-radius', radiusStyle); localStorage.setItem('novatools-radius', radiusStyle); writeCookie('novatools-radius', radiusStyle); }, [radiusStyle, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-ui-scale', uiScale); localStorage.setItem('novatools-ui-scale', uiScale); writeCookie('novatools-ui-scale', uiScale); }, [uiScale, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-motion', motionPreference); localStorage.setItem('novatools-motion', motionPreference); writeCookie('novatools-motion', motionPreference); }, [motionPreference, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-contrast', contrastPreference); localStorage.setItem('novatools-contrast', contrastPreference); writeCookie('novatools-contrast', contrastPreference); }, [contrastPreference, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-surface', surfaceStyle); localStorage.setItem('novatools-surface', surfaceStyle); writeCookie('novatools-surface', surfaceStyle); }, [surfaceStyle, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-card-density', cardDensity); localStorage.setItem('novatools-card-density', cardDensity); writeCookie('novatools-card-density', cardDensity); }, [cardDensity, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('novatools-theme', theme); writeCookie('novatools-theme', theme); }, [theme, ready]);
  useEffect(() => { if (!ready) return; document.documentElement.setAttribute('data-theme', colorTheme === 'custom' ? 'gold' : colorTheme); localStorage.setItem('novatools-color-theme', colorTheme); writeCookie('novatools-color-theme', colorTheme); if (colorTheme === 'custom') applyCustomColors(customColors); else clearCustomColors(); }, [colorTheme, customColors, ready]);
  function setColorTheme(t: ColorTheme) { localStorage.setItem('novatools-color-theme', t); writeCookie('novatools-color-theme', t); document.documentElement.setAttribute('data-theme', t === 'custom' ? 'gold' : t); if (t === 'custom') applyCustomColors(customColors); else clearCustomColors(); setColorThemeState(t); }
  function setCustomColors(c: CustomColors) { setCustomColorsState(c); localStorage.setItem('novatools-custom-colors', JSON.stringify(c)); writeCookie('novatools-custom-colors', JSON.stringify(c)); if (colorTheme === 'custom') applyCustomColors(c); }
  function toggleTheme() { setTheme((current) => { const next = current === 'dark' ? 'light' : 'dark'; document.documentElement.classList.toggle('dark', next === 'dark'); localStorage.setItem('novatools-theme', next); writeCookie('novatools-theme', next); return next; }); }
  if (!ready) return null;
  return <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme, setColorTheme, customColors, setCustomColors, fontPairing, setFontPairing: setFontPairingState, radiusStyle, setRadiusStyle: setRadiusStyleState, uiScale, setUiScale: setUiScaleState, motionPreference, setMotionPreference: setMotionPreferenceState, contrastPreference, setContrastPreference: setContrastPreferenceState, surfaceStyle, setSurfaceStyle: setSurfaceStyleState, cardDensity, setCardDensity: setCardDensityState }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be used within ThemeProvider'); return ctx; }
