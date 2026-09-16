'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export function MeetingCostCalculator() {
  const [attendees, setAttendees] = useState('6');
  const [avgSalary, setAvgSalary] = useState('80000');
  const [running, setRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const costPerSecond = useMemo(() => {
    const n = parseFloat(attendees);
    const salary = parseFloat(avgSalary);
    if (!n || !salary) return 0;
    // Assumes a 2080-hour work year (40hrs/week x 52 weeks).
    const perSecondPerPerson = salary / 2080 / 3600;
    return n * perSecondPerPerson;
  }, [attendees, avgSalary]);

  const cost = costPerSecond * elapsedSeconds;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <ToolShell outputValue={`${minutes}m ${seconds}s elapsed — $${cost.toFixed(2)} spent`} shareSlug="meeting-cost-calculator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Attendees</label>
          <input type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Average annual salary ($)</label>
          <input type="number" value={avgSalary} onChange={(e) => setAvgSalary(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl2 border border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/10 dark:bg-white/5">
        <p className="font-mono text-lg text-black/50 dark:text-white/50">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
        <p className="font-heading text-5xl font-bold text-primary-600 dark:text-primary-400">${cost.toFixed(2)}</p>
        <p className="text-sm text-black/50 dark:text-white/50">and counting...</p>
        <div className="flex gap-2">
          {!running ? (
            <Button onClick={() => setRunning(true)}><Play className="h-4 w-4" /> Start meeting</Button>
          ) : (
            <Button variant="secondary" onClick={() => setRunning(false)}><Pause className="h-4 w-4" /> Pause</Button>
          )}
          <Button variant="ghost" onClick={() => { setRunning(false); setElapsedSeconds(0); }}>Reset</Button>
        </div>
      </div>
    </ToolShell>
  );
}
