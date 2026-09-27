'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

export function ScreenRuler() {
  const [pxPerInch, setPxPerInch] = useState(96);
  const [calibrating, setCalibrating] = useState(false);
  const [cardWidthPx, setCardWidthPx] = useState(303);

  // A standard credit/ID card is 3.370 inches (85.60mm) wide — used for calibration.
  function finishCalibration() {
    setPxPerInch(Math.round(cardWidthPx / 3.37));
    setCalibrating(false);
  }

  return (
    <ToolShell outputValue={`${pxPerInch} px/inch`} shareSlug="screen-ruler">
      {!calibrating ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setCalibrating(true)}>
            Calibrate with a card
          </Button>
          <span className="text-sm text-black/50 dark:text-white/50">Currently: {pxPerInch} px/inch (adjust below if needed)</span>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl2 border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm">Drag the slider until the box below matches the width of a real credit/ID/debit card held against your screen.</p>
          <div style={{ width: cardWidthPx }} className="h-[191px] rounded-xl bg-gradient-brand shadow-glow" />
          <input type="range" min={200} max={420} value={cardWidthPx} onChange={(e) => setCardWidthPx(Number(e.target.value))} className="w-full accent-primary-500" />
          <Button size="sm" onClick={finishCalibration}>Done calibrating</Button>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Pixels per inch (manual override)</label>
        <input
          type="number"
          value={pxPerInch}
          onChange={(e) => setPxPerInch(Number(e.target.value))}
          className="w-32 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">12-inch ruler</p>
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/5">
          <div className="relative h-16" style={{ width: pxPerInch * 12 }}>
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="absolute top-0 flex h-full flex-col items-center" style={{ left: pxPerInch * i }}>
                <div className="h-full w-px bg-black/40 dark:bg-white/40" />
                <span className="mt-1 text-xs text-black/50 dark:text-white/50">{i}&quot;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">Accuracy depends on your screen&rsquo;s actual pixel density — calibrate with a physical card for best results.</p>
    </ToolShell>
  );
}
