'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function classify(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-accent' };
  if (bmi < 25) return { label: 'Healthy weight', color: 'text-success' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-warning' };
  return { label: 'Obese', color: 'text-danger' };
}

export function BmiCalculator() {
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('65');

  const bmi = useMemo(() => {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (!h || !w) return null;
    return w / (h * h);
  }, [heightCm, weightKg]);

  const result = bmi ? classify(bmi) : null;

  return (
    <ToolShell
      outputValue={bmi ? `BMI: ${bmi.toFixed(1)} (${result?.label})` : undefined}
      onReset={() => {
        setHeightCm('170');
        setWeightKg('65');
      }}
      shareSlug="bmi-calculator"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      {bmi && result && (
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 text-center dark:border-white/10 dark:bg-white/5">
          <div className="font-heading text-4xl font-bold">{bmi.toFixed(1)}</div>
          <div className={`mt-1 text-sm font-medium ${result.color}`}>{result.label}</div>
        </div>
      )}
    </ToolShell>
  );
}
