'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

const RATES = [5, 12, 18, 28];

export function GstCalculator() {
  const [amount, setAmount] = useState('1000');
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (!a) return null;
    if (mode === 'exclusive') {
      const gstAmount = (a * rate) / 100;
      return { base: a, gstAmount, total: a + gstAmount };
    }
    const base = a / (1 + rate / 100);
    const gstAmount = a - base;
    return { base, gstAmount, total: a };
  }, [amount, rate, mode]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

  return (
    <ToolShell
      outputValue={result ? `Base: ${fmt(result.base)} | GST: ${fmt(result.gstAmount)} | Total: ${fmt(result.total)}` : undefined}
      onReset={() => {
        setAmount('1000');
        setRate(18);
        setMode('exclusive');
      }}
      shareSlug="gst-calculator"
    >
      <div className="flex gap-2">
        {(['exclusive', 'inclusive'] as const).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? 'primary' : 'outline'} onClick={() => setMode(m)}>
            {m === 'exclusive' ? 'Add GST' : 'Remove GST'}
          </Button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">GST rate</label>
        <div className="flex flex-wrap gap-2">
          {RATES.map((r) => (
            <Button key={r} size="sm" variant={rate === r ? 'primary' : 'outline'} onClick={() => setRate(r)}>
              {r}%
            </Button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-xl font-bold">{fmt(result.base)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Base amount</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-xl font-bold">{fmt(result.gstAmount)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">GST amount</div>
          </div>
          <div className="rounded-xl border border-primary-400/30 bg-primary-50 p-4 text-center dark:bg-primary-500/10">
            <div className="font-heading text-xl font-bold text-primary-600 dark:text-primary-400">{fmt(result.total)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Total amount</div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
