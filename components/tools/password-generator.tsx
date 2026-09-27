'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generate(length: number, opts: Record<keyof typeof SETS, boolean>) {
  const pool = (Object.keys(opts) as (keyof typeof SETS)[])
    .filter((k) => opts[k])
    .map((k) => SETS[k])
    .join('');
  if (!pool) return '';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => pool[b % pool.length]).join('');
}

function strengthLabel(length: number, activeSets: number) {
  const score = length * activeSets;
  if (score < 40) return { label: 'Weak', color: 'bg-danger', width: '25%' };
  if (score < 80) return { label: 'Okay', color: 'bg-warning', width: '55%' };
  if (score < 120) return { label: 'Strong', color: 'bg-success', width: '80%' };
  return { label: 'Excellent', color: 'bg-success', width: '100%' };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generate(16, opts));

  const activeSets = Object.values(opts).filter(Boolean).length;
  const strength = useMemo(() => strengthLabel(length, activeSets), [length, activeSets]);

  function regenerate(nextLength = length, nextOpts = opts) {
    setPassword(generate(nextLength, nextOpts));
  }

  function toggle(key: keyof typeof SETS) {
    const next = { ...opts, [key]: !opts[key] };
    const stillHasOne = Object.values(next).some(Boolean);
    if (!stillHasOne) return;
    setOpts(next);
    regenerate(length, next);
  }

  return (
    <ToolShell outputValue={password} downloadFilename="password.txt" shareSlug="password-generator">
      <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 font-mono text-lg tracking-wide dark:border-white/10 dark:bg-white/5 sm:text-xl break-all">
        {password || 'Select at least one character type'}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-black/60 dark:text-white/60">Strength: {strength.label}</span>
        <Button size="sm" variant="secondary" onClick={() => regenerate()}>
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <label htmlFor="length">Length</label>
          <span className="font-mono">{length}</span>
        </div>
        <input
          id="length"
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLength(v);
            regenerate(v, opts);
          }}
          className="w-full accent-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {(Object.keys(SETS) as (keyof typeof SETS)[]).map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 px-3 py-2 dark:border-white/10"
          >
            <input type="checkbox" checked={opts[key]} onChange={() => toggle(key)} className="accent-primary-500" />
            <span className="capitalize">{key}</span>
          </label>
        ))}
      </div>
    </ToolShell>
  );
}
