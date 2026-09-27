'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function uuidv4() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes =
    typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function'
      ? crypto.getRandomValues(new Uint8Array(16))
      : Uint8Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function makeUuids(count: number) {
  return Array.from({ length: count }, () => uuidv4());
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => makeUuids(5));

  return (
    <ToolShell
      outputValue={uuids.join('\n')}
      downloadFilename="uuids.txt"
      onReset={() => setUuids(makeUuids(count))}
      shareSlug="uuid-generator"
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium">How many?</label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
          className="w-20 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        <Button size="sm" onClick={() => setUuids(makeUuids(count))}>
          <RefreshCw className="h-4 w-4" />
          Generate
        </Button>
      </div>

      <pre className="max-h-72 overflow-auto rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {uuids.join('\n')}
      </pre>
    </ToolShell>
  );
}
