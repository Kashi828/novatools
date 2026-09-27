'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function PercentageCalculator() {
  const [x, setX] = useState('20');
  const [y, setY] = useState('150');

  const whatIsXofY = useMemo(() => {
    const a = parseFloat(x);
    const b = parseFloat(y);
    if (isNaN(a) || isNaN(b)) return null;
    return (a / 100) * b;
  }, [x, y]);

  const xIsWhatPercentOfY = useMemo(() => {
    const a = parseFloat(x);
    const b = parseFloat(y);
    if (!a || !b) return null;
    return (a / b) * 100;
  }, [x, y]);

  return (
    <ToolShell
      outputValue={
        whatIsXofY !== null
          ? `${x}% of ${y} = ${whatIsXofY.toFixed(2)} | ${x} is ${xIsWhatPercentOfY?.toFixed(2)}% of ${y}`
          : undefined
      }
      onReset={() => {
        setX('20');
        setY('150');
      }}
      shareSlug="percentage-calculator"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Value X</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Value Y</label>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-black/50 dark:text-white/50">X% of Y</div>
          <div className="font-heading text-2xl font-bold">
            {whatIsXofY !== null ? whatIsXofY.toFixed(2) : '—'}
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-black/50 dark:text-white/50">X is what % of Y</div>
          <div className="font-heading text-2xl font-bold">
            {xIsWhatPercentOfY !== null ? `${xIsWhatPercentOfY.toFixed(2)}%` : '—'}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
