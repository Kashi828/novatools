'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function EmiCalculator() {
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('9.5');
  const [tenureYears, setTenureYears] = useState('5');

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const years = parseFloat(tenureYears);
    if (!p || !annualRate || !years) return null;

    const r = annualRate / 12 / 100;
    const n = years * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return { emi, totalPayment, totalInterest, n };
  }, [principal, rate, tenureYears]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <ToolShell
      outputValue={result ? `Monthly EMI: ${fmt(result.emi)} | Total interest: ${fmt(result.totalInterest)}` : undefined}
      onReset={() => {
        setPrincipal('500000');
        setRate('9.5');
        setTenureYears('5');
      }}
      shareSlug="emi-calculator"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Loan amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Interest rate (% p.a.)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tenure (years)</label>
          <input
            type="number"
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      {result && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-2xl font-bold">{fmt(result.emi)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Monthly EMI</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-2xl font-bold">{fmt(result.totalInterest)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Total interest</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-2xl font-bold">{fmt(result.totalPayment)}</div>
            <div className="text-xs text-black/50 dark:text-white/50">Total payment</div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
