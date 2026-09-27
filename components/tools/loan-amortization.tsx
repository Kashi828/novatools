'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function LoanAmortization() {
  const [principal, setPrincipal] = useState('300000');
  const [rate, setRate] = useState('7.5');
  const [years, setYears] = useState('15');

  const schedule = useMemo(() => {
    const p = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const y = parseFloat(years);
    if (!p || !annualRate || !y) return null;

    const monthlyRate = annualRate / 12 / 100;
    const n = y * 12;
    const payment = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

    let balance = p;
    const yearly: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= n; m++) {
      const interest = balance * monthlyRate;
      const principalPortion = payment - interest;
      balance -= principalPortion;
      yearPrincipal += principalPortion;
      yearInterest += interest;
      if (m % 12 === 0 || m === n) {
        yearly.push({ year: Math.ceil(m / 12), principalPaid: yearPrincipal, interestPaid: yearInterest, balance: Math.max(balance, 0) });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }

    return { payment, totalPaid: payment * n, totalInterest: payment * n - p, yearly };
  }, [principal, rate, years]);

  const fmt = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <ToolShell outputValue={schedule ? `Monthly payment: ${fmt(schedule.payment)} | Total interest: ${fmt(schedule.totalInterest)}` : undefined} shareSlug="loan-amortization">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Loan amount</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Interest rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Term (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      {schedule && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl2 border border-primary-400/30 bg-primary-50 p-4 text-center dark:bg-primary-500/10">
              <div className="font-heading text-xl font-bold text-primary-600 dark:text-primary-400">{fmt(schedule.payment)}</div>
              <div className="text-xs text-black/50 dark:text-white/50">Monthly payment</div>
            </div>
            <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-xl font-bold">{fmt(schedule.totalInterest)}</div>
              <div className="text-xs text-black/50 dark:text-white/50">Total interest</div>
            </div>
            <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-4 text-center dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-xl font-bold">{fmt(schedule.totalPaid)}</div>
              <div className="text-xs text-black/50 dark:text-white/50">Total paid</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.02] dark:bg-white/5">
                <tr>
                  <th className="p-2 text-left">Year</th>
                  <th className="p-2 text-right">Principal paid</th>
                  <th className="p-2 text-right">Interest paid</th>
                  <th className="p-2 text-right">Remaining balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.yearly.map((row) => (
                  <tr key={row.year} className="border-t border-black/5 dark:border-white/10">
                    <td className="p-2">{row.year}</td>
                    <td className="p-2 text-right">{fmt(row.principalPaid)}</td>
                    <td className="p-2 text-right">{fmt(row.interestPaid)}</td>
                    <td className="p-2 text-right">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ToolShell>
  );
}
