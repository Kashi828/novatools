'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

export function TimestampConverter() {
  const [unixInput, setUnixInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 19));

  const fromUnix = useMemo(() => {
    const n = Number(unixInput);
    if (isNaN(n)) return null;
    const ms = unit === 'seconds' ? n * 1000 : n;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return { iso: d.toISOString(), local: d.toString(), utc: d.toUTCString() };
  }, [unixInput, unit]);

  const toUnix = useMemo(() => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return { seconds: Math.floor(d.getTime() / 1000), milliseconds: d.getTime() };
  }, [dateInput]);

  return (
    <ToolShell outputValue={fromUnix ? `${fromUnix.iso} (UTC) | ${fromUnix.local}` : undefined} shareSlug="timestamp-converter">
      <div className="space-y-3 rounded-xl2 border border-black/10 p-4 dark:border-white/10">
        <h3 className="font-heading text-sm font-semibold">Unix timestamp → Date</h3>
        <div className="flex gap-2">
          <input
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
            className="flex-1 rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
          <Button size="sm" variant={unit === 'seconds' ? 'primary' : 'outline'} onClick={() => setUnit('seconds')}>sec</Button>
          <Button size="sm" variant={unit === 'milliseconds' ? 'primary' : 'outline'} onClick={() => setUnit('milliseconds')}>ms</Button>
          <Button size="sm" variant="ghost" onClick={() => setUnixInput(String(unit === 'seconds' ? Math.floor(Date.now() / 1000) : Date.now()))}>
            Now
          </Button>
        </div>
        {fromUnix ? (
          <div className="space-y-1 text-sm">
            <p><span className="text-black/50 dark:text-white/50">UTC:</span> {fromUnix.utc}</p>
            <p><span className="text-black/50 dark:text-white/50">Local:</span> {fromUnix.local}</p>
            <p><span className="text-black/50 dark:text-white/50">ISO 8601:</span> {fromUnix.iso}</p>
          </div>
        ) : (
          <p className="text-sm text-danger">Enter a valid number</p>
        )}
      </div>

      <div className="space-y-3 rounded-xl2 border border-black/10 p-4 dark:border-white/10">
        <h3 className="font-heading text-sm font-semibold">Date → Unix timestamp</h3>
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        {toUnix ? (
          <div className="space-y-1 text-sm">
            <p><span className="text-black/50 dark:text-white/50">Seconds:</span> {toUnix.seconds}</p>
            <p><span className="text-black/50 dark:text-white/50">Milliseconds:</span> {toUnix.milliseconds}</p>
          </div>
        ) : (
          <p className="text-sm text-danger">Enter a valid date</p>
        )}
      </div>
    </ToolShell>
  );
}
