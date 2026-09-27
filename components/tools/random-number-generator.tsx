'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';

function randomInt(min: number, max: number) {
  const range = max - min + 1;
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return min + (bytes[0] % range);
}

function generate(min: number, max: number, count: number, unique: boolean) {
  if (unique) {
    const range = max - min + 1;
    const size = Math.min(count, Math.max(range, 0));
    const pool = Array.from({ length: range }, (_, i) => min + i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, size);
  }
  return Array.from({ length: count }, () => randomInt(min, max));
}

export function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [unique, setUnique] = useState(false);
  const [numbers, setNumbers] = useState<number[]>(() => generate(1, 100, 5, false));
  const [error, setError] = useState<string | null>(null);

  function roll() {
    const minN = parseInt(min, 10);
    const maxN = parseInt(max, 10);
    const countN = parseInt(count, 10);
    if (isNaN(minN) || isNaN(maxN) || isNaN(countN) || minN > maxN || countN < 1) {
      setError('Check your min, max, and count values.');
      return;
    }
    if (unique && countN > maxN - minN + 1) {
      setError('Count is larger than the available unique range.');
      return;
    }
    setError(null);
    setNumbers(generate(minN, maxN, countN, unique));
  }

  return (
    <ToolShell outputValue={numbers.join(', ')} onReset={roll} shareSlug="random-number-generator">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Min</label>
          <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Max</label>
          <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-primary-500" />
        No duplicates
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button onClick={roll}>
        <Dices className="h-4 w-4" /> Generate
      </Button>

      <div className="flex flex-wrap gap-2">
        {numbers.map((n, i) => (
          <span key={i} className="rounded-lg bg-gradient-brand px-3 py-1.5 font-heading text-sm font-semibold text-white shadow-glow">
            {n}
          </span>
        ))}
      </div>
    </ToolShell>
  );
}
