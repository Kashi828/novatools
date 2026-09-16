'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Select } from '@/components/ui/select';
import { X } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from({ length: 8 }, (_, i) => 8 + i); // 8am - 3pm

interface ClassEntry {
  id: string;
  day: string;
  hour: number;
  name: string;
}

const COLORS = ['bg-primary-500', 'bg-secondary-500', 'bg-accent-500'];

export function ClassTimetable() {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [name, setName] = useState('');
  const [day, setDay] = useState('Mon');
  const [hour, setHour] = useState(9);

  function addClass() {
    if (!name.trim()) return;
    setClasses((prev) => [...prev, { id: crypto.randomUUID(), day, hour, name }]);
    setName('');
  }
  function removeClass(id: string) {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }

  const outputValue = classes
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.hour - b.hour)
    .map((c) => `${c.day} ${c.hour}:00 - ${c.name}`)
    .join('\n');

  return (
    <ToolShell outputValue={outputValue || undefined} downloadFilename="timetable.txt" shareSlug="class-timetable">
      <div className="flex flex-wrap items-end gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Class name" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <Select value={day} onChange={setDay} options={DAYS} className="w-28" />
        <Select value={String(hour)} onChange={(v) => setHour(Number(v))} options={HOURS.map((h) => ({ value: String(h), label: `${h}:00` }))} className="w-28" />
        <button onClick={addClass} className="rounded-lg bg-gradient-brand px-3 py-2 text-sm font-medium text-white shadow-glow">Add</button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-1" style={{ minWidth: 500 }}>
          <div />
          {DAYS.map((d) => (
            <div key={d} className="pb-1 text-center text-xs font-semibold text-black/50 dark:text-white/50">{d}</div>
          ))}
          {HOURS.map((h) => (
            <React.Fragment key={h}>
              <div className="pr-2 text-right text-xs text-black/40 dark:text-white/40">{h}:00</div>
              {DAYS.map((d) => {
                const entry = classes.find((c) => c.day === d && c.hour === h);
                return (
                  <div key={`${d}-${h}`} className="h-10 rounded border border-black/5 dark:border-white/10">
                    {entry && (
                      <div className={`group relative flex h-full items-center justify-center rounded px-1 text-center text-[10px] font-medium text-white ${COLORS[classes.indexOf(entry) % COLORS.length]}`}>
                        {entry.name}
                        <button onClick={() => removeClass(entry.id)} className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-danger text-white group-hover:flex">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
