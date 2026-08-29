'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette, Check, Sliders } from 'lucide-react';
import { useTheme, type ColorTheme, type FontPairing, type RadiusStyle } from '@/components/theme-provider';

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

const RADII: { key: RadiusStyle; label: string }[] = [
  { key: 'sharp', label: 'Sharp' },
  { key: 'rounded', label: 'Rounded' },
  { key: 'pill', label: 'Pill' },
];

export function ThemePicker() {
  const { colorTheme, setColorTheme, customColors, setCustomColors, fontPairing, setFontPairing, radiusStyle, setRadiusStyle } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose color theme"
        aria-haspopup="true"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition-colors hover:border-primary-400/50 dark:border-white/10"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 max-h-[80vh] w-72 overflow-y-auto rounded-xl border border-black/10 bg-white p-2 shadow-glass dark:border-white/10 dark:bg-[#111113]">
          <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Color theme</p>
          {PRESETS.map((t) => (
            <button
              key={t.key}
              onClick={() => setColorTheme(t.key)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              <span className="h-4 w-4 shrink-0 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: t.swatch }} />
              <span className="flex-1 text-left">{t.label}</span>
              {colorTheme === t.key && <Check className="h-3.5 w-3.5 text-primary-500" />}
            </button>
          ))}

          <button
            onClick={() => setColorTheme('custom')}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Sliders className="h-4 w-4 shrink-0 text-black/50 dark:text-white/50" />
            <span className="flex-1 text-left">Custom</span>
            {colorTheme === 'custom' && <Check className="h-3.5 w-3.5 text-primary-500" />}
          </button>

          {colorTheme === 'custom' && (
            <div className="mt-1 space-y-2 border-t border-black/10 px-2 pt-3 dark:border-white/10">
              {(['primary', 'secondary', 'accent'] as const).map((key) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <label className="text-xs capitalize text-black/60 dark:text-white/60">{key}</label>
                  <input
                    type="color"
                    value={customColors[key]}
                    onChange={(e) => setCustomColors({ ...customColors, [key]: e.target.value })}
                    className="h-7 w-12 cursor-pointer rounded border border-black/10 bg-transparent dark:border-white/20"
                  />
                </div>
              ))}
              <p className="pt-1 text-[11px] text-black/40 dark:text-white/40">
                Pick 3 base colors — every shade used across the site is generated automatically.
              </p>
            </div>
          )}

          <p className="mt-3 border-t border-black/10 px-2 pt-3 text-xs font-medium uppercase tracking-wide text-black/40 dark:border-white/10 dark:text-white/40">
            Font style
          </p>
          {FONTS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFontPairing(f.key)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              <span>{f.label}</span>
              {fontPairing === f.key && <Check className="h-3.5 w-3.5 text-primary-500" />}
            </button>
          ))}

          <p className="mt-3 border-t border-black/10 px-2 pt-3 text-xs font-medium uppercase tracking-wide text-black/40 dark:border-white/10 dark:text-white/40">
            Corner style
          </p>
          <div className="flex gap-1.5 px-2 py-1.5">
            {RADII.map((r) => (
              <button
                key={r.key}
                onClick={() => setRadiusStyle(r.key)}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                  radiusStyle === r.key
                    ? 'border-primary-400 bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                    : 'border-black/10 text-black/60 hover:border-primary-400/40 dark:border-white/10 dark:text-white/60'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
