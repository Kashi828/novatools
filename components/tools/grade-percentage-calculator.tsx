'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function letterGrade(percent: number) {
  if (percent >= 97) return 'A+';
  if (percent >= 93) return 'A';
  if (percent >= 90) return 'A-';
  if (percent >= 87) return 'B+';
  if (percent >= 83) return 'B';
  if (percent >= 80) return 'B-';
  if (percent >= 77) return 'C+';
  if (percent >= 73) return 'C';
  if (percent >= 70) return 'C-';
  if (percent >= 60) return 'D';
  return 'F';
}

export function GradePercentageCalculator() {
  const [obtained, setObtained] = useState('87');
  const [total, setTotal] = useState('100');

  const result = useMemo(() => {
    const o = parseFloat(obtained);
    const t = parseFloat(total);
    if (!o || !t) return null;
    const percent = (o / t) * 100;
    return { percent, letter: letterGrade(percent) };
  }, [obtained, total]);

  return (
    <ToolShell outputValue={result ? `${result.percent.toFixed(2)}% (${result.letter})` : undefined} shareSlug="grade-percentage-calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Marks obtained</label>
          <input type="number" value={obtained} onChange={(e) => setObtained(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Total marks</label>
          <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      {result && (
        <div className="rounded-xl2 border border-primary-400/30 bg-primary-50 p-6 text-center dark:bg-primary-500/10">
          <div className="font-heading text-4xl font-bold text-primary-600 dark:text-primary-400">{result.percent.toFixed(2)}%</div>
          <div className="mt-1 text-lg font-medium">Grade: {result.letter}</div>
        </div>
      )}
    </ToolShell>
  );
}
