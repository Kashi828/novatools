'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  if (isNaN(bigint)) return null;
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorPicker() {
  const [hex, setHex] = useState('#6366F1');

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : null;
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : null;

  return (
    <ToolShell outputValue={rgb ? `HEX: ${hex} | ${rgbString} | ${hslString}` : undefined} shareSlug="color-picker">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#6366F1'}
          onChange={(e) => setHex(e.target.value)}
          className="h-16 w-16 cursor-pointer rounded-xl border border-black/10 bg-transparent dark:border-white/10"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="flex-1 rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {rgb && hsl ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'HEX', value: hex.toUpperCase() },
            { label: 'RGB', value: rgbString! },
            { label: 'HSL', value: hslString! },
          ].map((f) => (
            <div key={f.label} className="rounded-xl border border-black/10 bg-black/[0.02] p-3 text-center dark:border-white/10 dark:bg-white/5">
              <div className="text-xs text-black/50 dark:text-white/50">{f.label}</div>
              <div className="font-mono text-sm font-medium">{f.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-danger">Enter a valid hex color (e.g. #6366F1)</p>
      )}
    </ToolShell>
  );
}
