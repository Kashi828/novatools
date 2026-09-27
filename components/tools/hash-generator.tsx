'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

const ALGORITHMS = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
] as const;

async function hash(text: string, algorithm: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function HashGenerator() {
  const [input, setInput] = useState('NovaTools');
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const entries = await Promise.all(ALGORITHMS.map(async (a) => [a.value, await hash(input, a.value)] as const));
      if (!cancelled) setResults(Object.fromEntries(entries));
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <ToolShell onReset={() => setInput('')} shareSlug="hash-generator">
      <div>
        <label className="mb-1 block text-sm font-medium">Text to hash</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="space-y-2">
        {ALGORITHMS.map((a) => (
          <div key={a.value} className="rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-medium text-black/50 dark:text-white/50">{a.label}</div>
            <div className="break-all font-mono text-sm">{results[a.value] ?? '—'}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">
        MD5 isn&rsquo;t included — modern browsers no longer expose it natively for security reasons. Use SHA-256 where possible.
      </p>
    </ToolShell>
  );
}
