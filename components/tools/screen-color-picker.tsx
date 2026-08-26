'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Pipette } from 'lucide-react';

interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperLike {
  open: () => Promise<EyeDropperResult>;
}

export function ScreenColorPicker() {
  const [color, setColor] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [supported] = useState(() => typeof window !== 'undefined' && 'EyeDropper' in window);

  async function pick() {
    const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => EyeDropperLike }).EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const result = await new EyeDropperCtor().open();
      setColor(result.sRGBHex);
      setHistory((prev) => [result.sRGBHex, ...prev].slice(0, 12));
    } catch {
      // User cancelled — no error needed.
    }
  }

  return (
    <ToolShell outputValue={color ?? undefined} shareSlug="screen-color-picker">
      {!supported ? (
        <p className="text-sm text-danger">
          Your browser doesn&rsquo;t support the screen color picker (EyeDropper API). Try Chrome or Edge on desktop.
        </p>
      ) : (
        <>
          <Button size="lg" onClick={pick}>
            <Pipette className="h-4 w-4" /> Pick a color from your screen
          </Button>

          {color && (
            <div className="flex items-center gap-4 rounded-xl2 border border-black/10 p-4 dark:border-white/10">
              <div className="h-16 w-16 rounded-xl border border-black/10 shadow-sm dark:border-white/10" style={{ backgroundColor: color }} />
              <p className="font-mono text-lg font-semibold">{color}</p>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Recent picks</p>
              <div className="flex flex-wrap gap-2">
                {history.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-lg border border-black/10 px-2 py-1 text-xs dark:border-white/10">
                    <span className="h-3 w-3 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: c }} />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </ToolShell>
  );
}
