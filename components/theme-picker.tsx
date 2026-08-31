'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Palette, Check, Sliders, X, RotateCcw } from 'lucide-react';
import {
  useTheme,
  DEFAULT_CUSTOM_COLORS,
  type ColorTheme,
  type CustomColors,
  type FontPairing,
  type RadiusStyle,
  type UiScale,
  type MotionPreference,
} from '@/components/theme-provider';

const PRESETS: { key: ColorTheme; label: string; swatch: string }[] = [
  { key: 'gold', label: 'Gold', swatch: '#C9A961' },
  { key: 'emerald', label: 'Emerald', swatch: '#34A876' },
  { key: 'sapphire', label: 'Sapphire', swatch: '#3E6FD9' },
  { key: 'rose', label: 'Rose', swatch: '#C97A8B' },
  { key: 'monochrome', label: 'Monochrome', swatch: '#B8B8B8' },
];

const FONTS: { key: FontPairing; label: string }[] = [
  { key: 'elegant', label: 'Elegant (serif)' },
  { key: 'modern', label: 'Modern (geometric)' },
  { key: 'classic', label: 'Classic (bold serif)' },
  { key: 'rounded', label: 'Rounded (friendly)' },
];

const SCALES: { key: UiScale; label: string }[] = [
  { key: 'compact', label: 'Compact' },
  { key: 'comfortable', label: 'Comfortable' },
  { key: 'large', label: 'Large' },
];

const MOTION: { key: MotionPreference; label: string }[] = [
  { key: 'full', label: 'Full motion' },
  { key: 'reduced', label: 'Reduced motion' },
];

const RADII: { key: RadiusStyle; label: string }[] = [
  { key: 'sharp', label: 'Sharp' },
  { key: 'rounded', label: 'Rounded' },
  { key: 'pill', label: 'Pill' },
];

const CUSTOM_KEYS: (keyof CustomColors)[] = ['primary', 'secondary', 'accent'];
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const ROW = 'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10';
const SECTION = 'mt-3 border-t border-black/10 px-2 pt-3 text-xs font-medium uppercase tracking-wide text-black/40 dark:border-white/10 dark:text-white/40';

function segment(active: boolean) {
  return `flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors ${
    active
      ? 'border-primary-400 bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
      : 'border-black/10 text-black/60 hover:border-primary-400/40 dark:border-white/10 dark:text-white/60'
  }`;
}

export function ThemePicker(): ReactNode {
  const {
    colorTheme,
    setColorTheme,
    customColors,
    setCustomColors,
    fontPairing,
    setFontPairing,
    radiusStyle,
    setRadiusStyle,
    uiScale,
    setUiScale,
    motionPreference,
    setMotionPreference,
  } = useTheme();

  const [open, setOpen] = useState(false);
  const [draftHex, setDraftHex] = useState<Partial<Record<keyof CustomColors, string>>>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setDraftHex({});
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        close();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  function updateColor(key: keyof CustomColors, value: string) {
    setCustomColors({ ...customColors, [key]: value });
  }

  function onHexTyped(key: keyof CustomColors, raw: string) {
    setDraftHex((draft) => ({ ...draft, [key]: raw }));
    const candidate = raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`;
    if (HEX_PATTERN.test(candidate)) {
      updateColor(key, candidate.toLowerCase());
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Appearance settings"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-transparent transition-colors hover:border-primary-400/50 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label="Appearance settings"
          className="absolute right-0 top-full z-[60] mt-2 max-h-[calc(100vh-5.5rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-xl2 border border-black/10 bg-white/95 p-2 shadow-2xl shadow-black/20 outline-none backdrop-blur-xl dark:border-white/10 dark:bg-[#111113]/95 dark:shadow-black/50"
        >
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Appearance</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close appearance settings"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className={SECTION.replace('mt-3 border-t', 'mt-1')}>Color theme</p>
          {PRESETS.map((preset) => (
            <button key={preset.key} type="button" onClick={() => setColorTheme(preset.key)} className={ROW}>
              <span className="h-4 w-4 shrink-0 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: preset.swatch }} />
              <span className="flex-1 text-left">{preset.label}</span>
              {colorTheme === preset.key && <Check className="h-3.5 w-3.5 shrink-0 text-primary-500" />}
            </button>
          ))}

          <button type="button" onClick={() => setColorTheme('custom')} className={ROW}>
            <Sliders className="h-4 w-4 shrink-0 text-black/50 dark:text-white/50" />
            <span className="flex-1 text-left">Custom</span>
            {colorTheme === 'custom' && <Check className="h-3.5 w-3.5 shrink-0 text-primary-500" />}
          </button>

          {colorTheme === 'custom' && (
            <div className="mt-1 space-y-2 border-t border-black/10 px-2 pt-3 dark:border-white/10">
              {CUSTOM_KEYS.map((key) => {
                const shown = draftHex[key] ?? customColors[key];
                const valid = HEX_PATTERN.test(shown.startsWith('#') ? shown : `#${shown}`);

                return (
                  <div key={key} className="flex items-center gap-2">
                    <label htmlFor={`custom-${key}`} className="w-20 shrink-0 text-xs capitalize text-black/60 dark:text-white/60">
                      {key}
                    </label>
                    <input
                      id={`custom-${key}`}
                      type="color"
                      value={customColors[key]}
                      onChange={(event) => {
                        setDraftHex((draft) => ({ ...draft, [key]: event.target.value }));
                        updateColor(key, event.target.value);
                      }}
                      className="h-7 w-10 shrink-0 cursor-pointer rounded border border-black/10 bg-transparent dark:border-white/20"
                    />
                    <input
                      type="text"
                      value={shown}
                      spellCheck={false}
                      maxLength={7}
                      aria-label={`${key} hex value`}
                      aria-invalid={!valid}
                      onChange={(event) => onHexTyped(key, event.target.value)}
                      onBlur={() => setDraftHex((draft) => ({ ...draft, [key]: undefined }))}
                      className={`min-w-0 flex-1 rounded border bg-transparent px-2 py-1 font-mono text-xs uppercase outline-none ${
                        valid ? 'border-black/10 dark:border-white/20' : 'border-danger text-danger'
                      }`}
                    />
                  </div>
                );
              })}

              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[11px] text-black/40 dark:text-white/40">Pick 3 base colors — every shade is generated from them.</p>
                <button
                  type="button"
                  onClick={() => {
                    setDraftHex({});
                    setCustomColors(DEFAULT_CUSTOM_COLORS);
                  }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-black/10 px-2 py-1 text-[11px] font-medium text-black/60 hover:border-primary-400/40 dark:border-white/10 dark:text-white/60"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>
            </div>
          )}

          <p className={SECTION}>Font style</p>
          {FONTS.map((font) => (
            <button
              key={font.key}
              type="button"
              onClick={() => setFontPairing(font.key)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              <span className="text-left">{font.label}</span>
              {fontPairing === font.key && <Check className="h-3.5 w-3.5 shrink-0 text-primary-500" />}
            </button>
          ))}

          <p className={SECTION}>Reading size</p>
          <div className="flex gap-1.5 px-2 py-1.5">
            {SCALES.map((scale) => (
              <button key={scale.key} type="button" onClick={() => setUiScale(scale.key)} className={segment(uiScale === scale.key)}>
                {scale.label}
              </button>
            ))}
          </div>

          <p className={SECTION}>Motion</p>
          <div className="flex gap-1.5 px-2 py-1.5">
            {MOTION.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMotionPreference(option.key)}
                className={segment(motionPreference === option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className={SECTION}>Corner style</p>
          <div className="flex gap-1.5 px-2 py-1.5">
            {RADII.map((radius) => (
              <button key={radius.key} type="button" onClick={() => setRadiusStyle(radius.key)} className={segment(radiusStyle === radius.key)}>
                {radius.label}
              </button>
            ))}
          </div>

          <div className="mx-2 mb-2 mt-1 rounded-xl2 border border-black/10 p-3 dark:border-white/10">
            <p className="text-[11px] leading-snug text-black/45 dark:text-white/45">Live preview — corners scale together so labels never crowd the edge.</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-lg bg-primary-500/15 px-2 py-1 text-[11px] font-medium text-primary-600 dark:text-primary-400">Card</span>
              <span className="h-8 rounded-lg border border-black/10 px-3 text-[11px] leading-8 dark:border-white/10">Button</span>
              <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] dark:bg-white/10">Chip</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
