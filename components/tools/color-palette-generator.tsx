'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

function hexToHsl(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const SCHEMES = ['analogous', 'complementary', 'triadic', 'monochromatic'] as const;
type Scheme = (typeof SCHEMES)[number];

function buildPalette(base: string, scheme: Scheme): string[] {
  const { h, s, l } = hexToHsl(base);
  switch (scheme) {
    case 'complementary':
      return [base.toUpperCase(), hslToHex(h + 180, s, l), hslToHex(h, s, Math.min(l + 20, 90)), hslToHex(h + 180, s, Math.min(l + 20, 90)), hslToHex(h, s, Math.max(l - 20, 10))];
    case 'triadic':
      return [base.toUpperCase(), hslToHex(h + 120, s, l), hslToHex(h + 240, s, l), hslToHex(h + 120, s, Math.min(l + 15, 90)), hslToHex(h + 240, s, Math.max(l - 15, 10))];
    case 'monochromatic':
      return [10, 30, 50, 70, 90].map((lightness) => hslToHex(h, s, lightness));
    default:
      return [-30, -15, 0, 15, 30].map((offset) => hslToHex(h + offset, s, l));
  }
}

export function ColorPaletteGenerator() {
  const [base, setBase] = useState('#6366F1');
  const [scheme, setScheme] = useState<Scheme>('analogous');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const palette = useMemo(() => buildPalette(base, scheme), [base, scheme]);

  function copy(hex: string) {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1200);
  }

  return (
    <ToolShell outputValue={palette.join(', ')} shareSlug="color-palette-generator">
      <div className="flex items-center gap-3">
        <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-12 w-12 cursor-pointer rounded-xl border border-black/10 dark:border-white/10" />
        <input value={base} onChange={(e) => setBase(e.target.value)} className="flex-1 rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
      </div>

      <div className="flex flex-wrap gap-2">
        {SCHEMES.map((s) => (
          <Button key={s} size="sm" variant={scheme === s ? 'primary' : 'outline'} onClick={() => setScheme(s)} className="capitalize">
            {s}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {palette.map((hex) => (
          <button key={hex} onClick={() => copy(hex)} className="group flex flex-col items-center gap-2">
            <div className="h-20 w-full rounded-xl border border-black/10 shadow-sm dark:border-white/10" style={{ backgroundColor: hex }} />
            <span className="flex items-center gap-1 font-mono text-xs">
              {copiedHex === hex ? 'Copied!' : hex}
              <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
            </span>
          </button>
        ))}
      </div>
    </ToolShell>
  );
}
