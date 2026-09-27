'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const bigint = parseInt(full, 16);
  if (isNaN(bigint) || full.length !== 6) return null;
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return null;
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

export function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#0B1120');
  const [background, setBackground] = useState('#FFFFFF');

  const ratio = useMemo(() => contrastRatio(foreground, background), [foreground, background]);

  const checks = ratio
    ? {
        normalAA: ratio >= 4.5,
        normalAAA: ratio >= 7,
        largeAA: ratio >= 3,
        largeAAA: ratio >= 4.5,
      }
    : null;

  return (
    <ToolShell outputValue={ratio ? `Contrast ratio: ${ratio.toFixed(2)}:1` : undefined} shareSlug="color-contrast-checker">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Text color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={foreground} onChange={(e) => setForeground(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-black/10 dark:border-white/10" />
            <input value={foreground} onChange={(e) => setForeground(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-2.5 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Background color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-black/10 dark:border-white/10" />
            <input value={background} onChange={(e) => setBackground(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-2.5 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-black/10 p-8 text-center dark:border-white/10" style={{ backgroundColor: background, color: foreground }}>
        <p className="text-2xl font-bold">The quick brown fox</p>
        <p className="mt-1 text-sm">jumps over the lazy dog</p>
      </div>

      {ratio && checks && (
        <>
          <p className="text-center font-heading text-3xl font-bold">{ratio.toFixed(2)}:1</p>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              { label: 'Normal text AA', pass: checks.normalAA },
              { label: 'Normal text AAA', pass: checks.normalAAA },
              { label: 'Large text AA', pass: checks.largeAA },
              { label: 'Large text AAA', pass: checks.largeAAA },
            ].map((c) => (
              <div key={c.label} className={`rounded-xl border p-3 text-center ${c.pass ? 'border-success/30 bg-success/5 text-success' : 'border-danger/30 bg-danger/5 text-danger'}`}>
                <div className="font-semibold">{c.pass ? 'Pass' : 'Fail'}</div>
                <div className="text-xs opacity-80">{c.label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </ToolShell>
  );
}
