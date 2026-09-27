'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function diffBreakdown(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('2000-01-01');

  const result = useMemo(() => {
    const from = new Date(birthDate);
    if (isNaN(from.getTime())) return null;
    return diffBreakdown(from, new Date());
  }, [birthDate]);

  return (
    <ToolShell
      outputValue={
        result ? `${result.years} years, ${result.months} months, ${result.days} days (${result.totalDays} days total)` : undefined
      }
      onReset={() => setBirthDate('2000-01-01')}
      shareSlug="age-calculator"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Date of birth</label>
        <input
          type="date"
          value={birthDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {result && (
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Years', value: result.years },
            { label: 'Months', value: result.months },
            { label: 'Days', value: result.days },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-3xl font-bold">{item.value}</div>
              <div className="text-xs text-black/50 dark:text-white/50">{item.label}</div>
            </div>
          ))}
          <div className="col-span-3 text-center text-sm text-black/50 dark:text-white/50">
            {result.totalDays.toLocaleString()} days lived so far
          </div>
        </div>
      )}
    </ToolShell>
  );
}
