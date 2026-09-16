'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function getBreakdown(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function CountdownTimer() {
  const [target, setTarget] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 16);
  });
  const [label, setLabel] = useState('New Year');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const breakdown = useMemo(() => {
    const t = new Date(target);
    if (isNaN(t.getTime())) return null;
    return getBreakdown(t, now);
  }, [target, now]);

  return (
    <ToolShell
      outputValue={breakdown ? `${breakdown.days}d ${breakdown.hours}h ${breakdown.minutes}m ${breakdown.seconds}s until ${label}` : undefined}
      shareSlug="countdown-timer"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Event name</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Target date & time</label>
          <input
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      {breakdown ? (
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: 'Days', value: breakdown.days },
            { label: 'Hours', value: breakdown.hours },
            { label: 'Minutes', value: breakdown.minutes },
            { label: 'Seconds', value: breakdown.seconds },
          ].map((item) => (
            <div key={item.label} className="rounded-xl2 border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-3xl font-bold tabular-nums">{item.value}</div>
              <div className="text-xs text-black/50 dark:text-white/50">{item.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-black/50 dark:text-white/50">
          {label} has already happened, or the date is invalid.
        </p>
      )}
    </ToolShell>
  );
}
