'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Palette, Check, Sliders, X, RotateCcw, Sun, Moon } from 'lucide-react';
import { useTheme, DEFAULT_CUSTOM_COLORS, type ColorTheme, type CustomColors, type FontPairing, type RadiusStyle, type UiScale, type MotionPreference } from '@/components/theme-provider';

const PRESETS: { key: ColorTheme; label: string; swatch: string; detail: string }[] = [
  { key: 'gold', label: 'Gold', swatch: '#C9A961', detail: 'Warm editorial' },
  { key: 'emerald', label: 'Emerald', swatch: '#34A876', detail: 'Calm + fresh' },
  { key: 'sapphire', label: 'Sapphire', swatch: '#3E6FD9', detail: 'Focused + crisp' },
  { key: 'rose', label: 'Rose', swatch: '#C97A8B', detail: 'Soft + expressive' },
  { key: 'monochrome', label: 'Mono', swatch: '#B8B8B8', detail: 'Minimal + neutral' },
];
const FONTS: { key: FontPairing; label: string }[] = [
  { key: 'elegant', label: 'Elegant' }, { key: 'modern', label: 'Modern' }, { key: 'classic', label: 'Classic' }, { key: 'rounded', label: 'Rounded' },
];
const SCALES: { key: UiScale; label: string }[] = [{ key: 'compact', label: 'Compact' }, { key: 'comfortable', label: 'Comfortable' }, { key: 'large', label: 'Large' }];
const MOTION: { key: MotionPreference; label: string }[] = [{ key: 'full', label: 'Full' }, { key: 'reduced', label: 'Reduced' }];
const RADII: { key: RadiusStyle; label: string }[] = [{ key: 'sharp', label: 'Sharp' }, { key: 'rounded', label: 'Rounded' }, { key: 'pill', label: 'Pill' }];
const CUSTOM_KEYS: (keyof CustomColors)[] = ['primary', 'secondary', 'accent'];
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function ThemePicker(): ReactNode {
  const { theme, toggleTheme, colorTheme, setColorTheme, customColors, setCustomColors, fontPairing, setFontPairing, radiusStyle, setRadiusStyle, uiScale, setUiScale, motionPreference, setMotionPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const [draftHex, setDraftHex] = useState<Partial<Record<keyof CustomColors, string>>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => { setOpen(false); setDraftHex({}); triggerRef.current?.focus(); }, []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    const pointer = (event: PointerEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) close(); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', pointer); panelRef.current?.focus();
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', pointer); };
  }, [open, close]);

  const updateColor = (key: keyof CustomColors, value: string) => setCustomColors({ ...customColors, [key]: value });
  const onHexTyped = (key: keyof CustomColors, raw: string) => {
    setDraftHex((draft) => ({ ...draft, [key]: raw }));
    const candidate = raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`;
    if (HEX_PATTERN.test(candidate)) updateColor(key, candidate.toLowerCase());
  };
  const segment = (active: boolean) => `nova-control flex-1 rounded-lg px-2.5 py-2 text-[11px] font-semibold ${active ? 'border-primary-500/50 bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-secondary-400'}`;

  return (
    <div ref={wrapperRef} className="relative">
      <button ref={triggerRef} type="button" onClick={() => setOpen((v) => !v)} aria-label="Appearance settings" aria-expanded={open} aria-haspopup="dialog" className="nova-control flex h-9 w-9 items-center justify-center rounded-lg">
        <Palette className="h-4 w-4" />
      </button>
      {open && <div ref={panelRef} tabIndex={-1} role="dialog" aria-label="Appearance settings" className="nova-overlay absolute right-0 top-full z-[60] mt-3 w-[min(25rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl outline-none">
        <div className="border-b border-current/10 px-4 py-3.5">
          <div className="flex items-center justify-between"><div><p className="nova-eyebrow">NovaTools</p><h2 className="mt-0.5 text-base font-semibold">Appearance</h2></div><button type="button" onClick={close} aria-label="Close appearance settings" className="nova-control flex h-8 w-8 items-center justify-center rounded-lg"><X className="h-4 w-4" /></button></div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => theme === 'dark' && toggleTheme()} className={`${segment(theme === 'light')} flex items-center justify-center gap-2`}><Sun className="h-3.5 w-3.5" /> Light</button>
            <button type="button" onClick={() => theme === 'light' && toggleTheme()} className={`${segment(theme === 'dark')} flex items-center justify-center gap-2`}><Moon className="h-3.5 w-3.5" /> Dark</button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-4 pb-4">
          <div className="pt-4"><div className="mb-2.5 flex items-end justify-between"><div><p className="text-sm font-semibold">Color system</p><p className="nova-muted mt-0.5 text-[11px]">Choose the accent that drives the interface.</p></div></div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {PRESETS.map((preset) => <button key={preset.key} type="button" onClick={() => setColorTheme(preset.key)} className={`nova-control group rounded-xl p-2.5 text-left ${colorTheme === preset.key ? 'border-primary-500/55 bg-primary-500/10' : ''}`}><span className="flex items-center gap-2.5"><span className="h-6 w-6 rounded-lg shadow-inner" style={{ background: `linear-gradient(135deg, ${preset.swatch}, color-mix(in srgb, ${preset.swatch} 62%, black))` }} /> <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{preset.label}</span><span className="nova-muted block truncate text-[10px]">{preset.detail}</span></span>{colorTheme === preset.key && <Check className="h-3.5 w-3.5 text-primary-500" />}</span></button>)}
            </div>
            <button type="button" onClick={() => setColorTheme('custom')} className={`nova-control mt-2.5 flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left ${colorTheme === 'custom' ? 'border-primary-500/55 bg-primary-500/10' : ''}`}><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500"><Sliders className="h-3.5 w-3.5" /></span><span className="flex-1"><span className="block text-xs font-semibold">Custom palette</span><span className="nova-muted block text-[10px]">Build your own primary, secondary and accent</span></span>{colorTheme === 'custom' && <Check className="h-3.5 w-3.5 text-primary-500" />}</button>
          </div>

          {colorTheme === 'custom' && <div className="nova-surface-muted mt-3 rounded-xl p-3"><div className="space-y-2.5">{CUSTOM_KEYS.map((key) => { const shown = draftHex[key] ?? customColors[key]; const valid = HEX_PATTERN.test(shown.startsWith('#') ? shown : `#${shown}`); return <div key={key} className="flex items-center gap-2"><label htmlFor={`custom-${key}`} className="w-16 shrink-0 text-xs font-semibold capitalize">{key}</label><input id={`custom-${key}`} type="color" value={customColors[key]} onChange={(e) => { setDraftHex((d) => ({ ...d, [key]: e.target.value })); updateColor(key, e.target.value); }} className="h-8 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0" /><input type="text" value={shown} spellCheck={false} maxLength={7} aria-label={`${key} hex value`} aria-invalid={!valid} onChange={(e) => onHexTyped(key, e.target.value)} onBlur={() => setDraftHex((d) => ({ ...d, [key]: undefined }))} className={`min-w-0 flex-1 rounded-lg border bg-transparent px-2.5 py-1.5 font-mono text-xs uppercase outline-none ${valid ? '' : 'border-danger text-danger'}`} /></div>; })}</div><div className="mt-3 flex items-center justify-between gap-2"><p className="nova-muted text-[10px] leading-4">Colors generate the complete NovaTools shade ramp.</p><button type="button" onClick={() => { setDraftHex({}); setCustomColors(DEFAULT_CUSTOM_COLORS); }} className="nova-control inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold"><RotateCcw className="h-3 w-3" /> Reset</button></div></div>}

          <div className="mt-5 border-t border-current/10 pt-4"><p className="mb-2.5 text-sm font-semibold">Type & shape</p><div className="grid grid-cols-2 gap-2">{FONTS.map((font) => <button key={font.key} type="button" onClick={() => setFontPairing(font.key)} className={`nova-control rounded-lg px-2.5 py-2 text-left text-xs font-semibold ${fontPairing === font.key ? 'border-primary-500/50 bg-primary-500/10 text-primary-600 dark:text-primary-400' : ''}`}>{font.label}</button>)}</div><div className="mt-2 grid grid-cols-3 gap-2">{RADII.map((radius) => <button key={radius.key} type="button" onClick={() => setRadiusStyle(radius.key)} className={`nova-control rounded-lg px-2 py-2 text-[10px] font-semibold ${radiusStyle === radius.key ? 'border-primary-500/50 bg-primary-500/10 text-primary-600 dark:text-primary-400' : ''}`}>{radius.label}</button>)}</div></div>

          <div className="mt-5 border-t border-current/10 pt-4"><p className="mb-2.5 text-sm font-semibold">Density & motion</p><div className="flex gap-2"><div className="nova-surface-muted flex flex-1 gap-1 rounded-xl p-1">{SCALES.map((scale) => <button key={scale.key} type="button" onClick={() => setUiScale(scale.key)} className={segment(uiScale === scale.key)}>{scale.label}</button>)}</div></div><div className="mt-2 flex gap-2"><div className="nova-surface-muted flex flex-1 gap-1 rounded-xl p-1">{MOTION.map((option) => <button key={option.key} type="button" onClick={() => setMotionPreference(option.key)} className={segment(motionPreference === option.key)}>{option.label}</button>)}</div></div></div>

          <div className="nova-surface-muted mt-4 rounded-xl p-3"><div className="flex items-center justify-between"><span className="text-xs font-semibold">Live preview</span><span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_12px_rgb(var(--color-primary-500)/.6)]" /></div><div className="mt-2.5 flex gap-2"><span className="rounded-lg bg-primary-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-primary-600 dark:text-primary-400">Primary</span><span className="nova-control rounded-lg px-2.5 py-1.5 text-[10px] font-semibold">Surface</span><span className="rounded-full bg-current/10 px-2 py-1 text-[10px] font-semibold">Chip</span></div></div>
        </div>
      </div>}
    </div>
  );
}
