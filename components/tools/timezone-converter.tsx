'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Select } from '@/components/ui/select';

const ZONES = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Sao_Paulo',
  'Europe/London', 'Europe/Paris', 'Europe/Moscow', 'Africa/Cairo',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Tokyo',
  'Australia/Sydney', 'Pacific/Auckland',
];

function formatInZone(date: Date, zone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function TimezoneConverter() {
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [sourceZone, setSourceZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  const utcDate = useMemo(() => {
    const naive = new Date(dateTime);
    if (isNaN(naive.getTime())) return null;
    const tzDate = new Date(naive.toLocaleString('en-US', { timeZone: sourceZone }));
    const diff = naive.getTime() - tzDate.getTime();
    return new Date(naive.getTime() + diff);
  }, [dateTime, sourceZone]);

  return (
    <ToolShell shareSlug="timezone-converter">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Date & time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">In this timezone</label>
          <Select value={sourceZone} onChange={setSourceZone} options={ZONES} />
        </div>
      </div>

      {utcDate && (
        <div className="space-y-2">
          {ZONES.map((zone) => (
            <div
              key={zone}
              className={`flex items-center justify-between rounded-xl border p-3 text-sm ${
                zone === sourceZone
                  ? 'border-primary-400/40 bg-primary-50 dark:bg-primary-500/10'
                  : 'border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/5'
              }`}
            >
              <span className="font-medium">{zone}</span>
              <span className="font-mono">{formatInZone(utcDate, zone)}</span>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
