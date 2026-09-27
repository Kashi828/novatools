'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Select } from '@/components/ui/select';

const UNITS: Record<string, number> = {
  bit: 1 / 8,
  byte: 1,
  KB: 1000,
  MB: 1000 ** 2,
  GB: 1000 ** 3,
  TB: 1000 ** 4,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
};

export function FileSizeConverter() {
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('MB');
  const [to, setTo] = useState('MiB');

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const bytes = v * UNITS[from];
    return bytes / UNITS[to];
  }, [value, from, to]);

  return (
    <ToolShell outputValue={result !== null ? `${value} ${from} = ${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to}` : undefined} shareSlug="file-size-converter">
      <div>
        <label className="mb-1 block text-sm font-medium">Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">From</label>
          <Select value={from} onChange={setFrom} options={Object.keys(UNITS)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">To</label>
          <Select value={to} onChange={setTo} options={Object.keys(UNITS)} />
        </div>
      </div>

      {result !== null && (
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 text-center dark:border-white/10 dark:bg-white/5">
          <div className="font-heading text-3xl font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
          <div className="mt-1 text-sm text-black/50 dark:text-white/50">{to}</div>
        </div>
      )}
      <p className="text-xs text-black/40 dark:text-white/40">KB/MB/GB use decimal (1000-based); KiB/MiB/GiB use binary (1024-based), matching how OSes actually report file sizes.</p>
    </ToolShell>
  );
}
