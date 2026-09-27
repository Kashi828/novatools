'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

const BASES = [
  { label: 'Binary', base: 2, pattern: /^[01]*$/ },
  { label: 'Octal', base: 8, pattern: /^[0-7]*$/ },
  { label: 'Decimal', base: 10, pattern: /^[0-9]*$/ },
  { label: 'Hexadecimal', base: 16, pattern: /^[0-9a-fA-F]*$/ },
] as const;

export function NumberBaseConverter() {
  const [values, setValues] = useState<Record<number, string>>({ 2: '', 8: '', 10: '42', 16: '' });
  const [error, setError] = useState<string | null>(null);

  function updateFrom(base: number, raw: string) {
    const entry = BASES.find((b) => b.base === base)!;
    if (!entry.pattern.test(raw)) {
      setError(`"${raw}" contains characters invalid for ${entry.label.toLowerCase()}.`);
      setValues((prev) => ({ ...prev, [base]: raw }));
      return;
    }
    setError(null);
    if (raw === '') {
      setValues({ 2: '', 8: '', 10: '', 16: '' });
      return;
    }
    const decimal = parseInt(raw, base);
    if (isNaN(decimal)) {
      setValues((prev) => ({ ...prev, [base]: raw }));
      return;
    }
    setValues({
      2: decimal.toString(2),
      8: decimal.toString(8),
      10: decimal.toString(10),
      16: decimal.toString(16).toUpperCase(),
    });
  }

  return (
    <ToolShell outputValue={`bin ${values[2]} | oct ${values[8]} | dec ${values[10]} | hex ${values[16]}`} onReset={() => setValues({ 2: '', 8: '', 10: '', 16: '' })} shareSlug="number-base-converter">
      <div className="space-y-3">
        {BASES.map((b) => (
          <div key={b.base}>
            <label className="mb-1 block text-sm font-medium">{b.label} (base {b.base})</label>
            <input
              value={values[b.base]}
              onChange={(e) => updateFrom(b.base, e.target.value)}
              spellCheck={false}
              className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
            />
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </ToolShell>
  );
}
