'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, type ColorTheme } from '@/components/theme-provider';

const THEMES: { key: ColorTheme; label: string; swatch: string }[] = [
  { key: 'gold', label: 'Gold', swatch: '#C9A961' },
  { key: 'emerald', label: 'Emerald', swatch: '#34A876' },
  { key: 'sapphire', label: 'Sapphire', swatch: '#3E6FD9' },
  { key: 'rose', label: 'Rose', swatch: '#C97A8B' },
  { key: 'monochrome', label: 'Monochrome', swatch: '#B8B8B8' },
];

export function ThemePicker() {
  const { colorTheme, setColorTheme } = useTheme();
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
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-black/10 bg-white p-2 shadow-glass dark:border-white/10 dark:bg-[#111113]">
          <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">Color theme</p>
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setColorTheme(t.key);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              <span className="h-4 w-4 shrink-0 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: t.swatch }} />
              <span className="flex-1 text-left">{t.label}</span>
              {colorTheme === t.key && <Check className="h-3.5 w-3.5 text-primary-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
