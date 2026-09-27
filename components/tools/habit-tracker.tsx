'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Check, X } from 'lucide-react';

const STORAGE_KEY = 'novatools-habit-tracker';
const DAYS = 30;

interface HabitData {
  habits: string[];
  checks: Record<string, boolean>; // key: `${habit}-${day}`
}

export function HabitTracker() {
  const [data, setData] = useState<HabitData>({ habits: ['Drink water', 'Exercise', 'Read'], checks: {} });
  const [newHabit, setNewHabit] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        // Ignore malformed saved data.
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, loaded]);

  function toggle(habit: string, day: number) {
    const key = `${habit}-${day}`;
    setData((prev) => ({ ...prev, checks: { ...prev.checks, [key]: !prev.checks[key] } }));
  }
  function addHabit() {
    if (!newHabit.trim()) return;
    setData((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
    setNewHabit('');
  }
  function removeHabit(habit: string) {
    setData((prev) => ({ ...prev, habits: prev.habits.filter((h) => h !== habit) }));
  }

  return (
    <ToolShell shareSlug="habit-tracker">
      <div className="flex gap-2">
        <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="New habit..." className="flex-1 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <button onClick={addHabit} className="rounded-lg bg-gradient-brand px-3 py-2 text-sm font-medium text-white shadow-glow">Add</button>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white p-1 text-left dark:bg-[#0A0A0B]">Habit</th>
              {Array.from({ length: DAYS }, (_, i) => (
                <th key={i} className="w-6 p-0.5 text-center text-black/40 dark:text-white/40">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.habits.map((habit) => (
              <tr key={habit}>
                <td className="sticky left-0 flex items-center gap-1 bg-white pr-2 dark:bg-[#0A0A0B]">
                  <button onClick={() => removeHabit(habit)} className="text-black/20 hover:text-danger"><X className="h-3 w-3" /></button>
                  <span className="whitespace-nowrap">{habit}</span>
                </td>
                {Array.from({ length: DAYS }, (_, i) => {
                  const checked = !!data.checks[`${habit}-${i}`];
                  return (
                    <td key={i} className="p-0.5">
                      <button
                        onClick={() => toggle(habit, i)}
                        className={`flex h-5 w-5 items-center justify-center rounded ${checked ? 'bg-success' : 'bg-black/5 dark:bg-white/10'}`}
                      >
                        {checked && <Check className="h-3 w-3 text-white" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">Saved only in this browser — a rolling 30-day grid.</p>
    </ToolShell>
  );
}
