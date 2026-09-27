'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

const TIP_PRESETS = [10, 15, 18, 20, 25];

export function TipCalculator() {
  const [bill, setBill] = useState('50');
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState('1');

  const result = useMemo(() => {
    const b = parseFloat(bill);
    const p = Math.max(1, parseInt(people, 10) || 1);
    if (!b) return null;
    const tip = (b * tipPercent) / 100;
    const total = b + tip;
    return { tip, total, perPerson: total / p, tipPerPerson: tip / p };
  }, [bill, tipPercent, people]);

  const fmt = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <ToolShell
      outputValue={result ? `Tip: ${fmt(result.tip)} | Total: ${fmt(result.total)} | Per person: ${fmt(result.perPerson)}` : undefined}
      onReset={() => { setBill(''); setPeople('1'); }}
      shareSlug="tip-calculator"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Bill amount</label>
        <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Tip percentage</label>
        <div className="flex flex-wrap gap-2">
          {TIP_PRESETS.map((p) => (
            <Button key={p} size="sm" variant={tipPercent === p ? 'primary' : 'outline'} onClick={() => setTipPercent(p)}>
              {p}%
            </Button>
          ))}
        </div>
        <input type="range" min={0} max={40} value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="mt-3 w-full accent-primary-500" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Split between</label>
        <input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-xl font-bold">{fmt(result.tip)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Tip</div>
          </div>
          <div className="rounded-xl border border-primary-400/30 bg-primary-50 p-4 text-center dark:bg-primary-500/10">
            <div className="font-heading text-xl font-bold text-primary-600 dark:text-primary-400">{fmt(result.total)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Total</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-xl font-bold">{fmt(result.perPerson)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Per person</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-xl font-bold">{fmt(result.tipPerPerson)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Tip per person</div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
