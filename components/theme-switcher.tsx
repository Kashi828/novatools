'use client';

import { useState } from 'react';
import { Check, Moon, Palette, Sun } from 'lucide-react';
import { useTheme, type ColorTheme } from '@/components/theme-provider';

const themes: Array<{ id: ColorTheme; label: string }> = [
  { id: 'gold', label: 'Gold' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'sapphire', label: 'Sapphire' },
  { id: 'rose', label: 'Rose' },
  { id: 'monochrome', label: 'Mono' },
];

export function ThemeSwitcher() {
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button type="button" aria-label="Open appearance settings" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white">
        <Palette className="h-4 w-4" />
      </button>
      {open && <>
        <button className="fixed inset-0 z-40 cursor-default" aria-label="Close appearance settings" onClick={() => setOpen(false)} />
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-2 shadow-xl dark:border-white/[0.1] dark:bg-zinc-950">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-black/45 dark:text-white/45">Appearance</div>
          <button type="button" onClick={toggleTheme} className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/5">
            <span className="flex items-center gap-2"><Sun className="h-4 w-4 dark:hidden" /><Moon className="hidden h-4 w-4 dark:block" /> {theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <div className="my-1 border-t border-black/[0.06] dark:border-white/[0.08]" />
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-black/45 dark:text-white/45">Accent</div>
          {themes.map((item) => <button key={item.id} type="button" onClick={() => setColorTheme(item.id)} className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/5"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-500" />{item.label}</span>{colorTheme === item.id && <Check className="h-4 w-4 text-primary-500" />}</button>)}
        </div>
      </>}
    </div>
  );
}
