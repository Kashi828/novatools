'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { X } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  date: string;
}

function daysUntil(dateStr: string, now: Date) {
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function ExamCountdownPlanner() {
  const [exams, setExams] = useState<Exam[]>([
    { id: '1', name: 'Midterm', date: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10) },
    { id: '2', name: 'Final Exam', date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) },
  ]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  function addExam() {
    if (!name.trim() || !date) return;
    setExams((prev) => [...prev, { id: crypto.randomUUID(), name, date }].sort((a, b) => a.date.localeCompare(b.date)));
    setName('');
    setDate('');
  }
  function removeExam(id: string) {
    setExams((prev) => prev.filter((e) => e.id !== id));
  }

  const outputValue = exams.map((e) => `${e.name}: ${daysUntil(e.date, now)} days`).join('\n');

  return (
    <ToolShell outputValue={outputValue || undefined} shareSlug="exam-countdown-planner">
      <div className="flex flex-wrap items-end gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Exam name" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <button onClick={addExam} className="rounded-lg bg-gradient-brand px-3 py-2 text-sm font-medium text-white shadow-glow">Add exam</button>
      </div>

      <div className="space-y-2">
        {exams.map((exam) => {
          const days = daysUntil(exam.date, now);
          return (
            <div key={exam.id} className="flex items-center justify-between rounded-xl2 border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
              <div>
                <div className="font-medium">{exam.name}</div>
                <div className="text-xs text-black/50 dark:text-white/50">{new Date(exam.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-heading text-2xl font-bold ${days <= 3 ? 'text-danger' : days <= 7 ? 'text-warning' : ''}`}>
                    {days >= 0 ? days : 0}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50">{days >= 0 ? 'days left' : 'passed'}</div>
                </div>
                <button onClick={() => removeExam(exam.id)} className="text-black/30 hover:text-danger dark:text-white/30"><X className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
        {exams.length === 0 && <p className="text-center text-sm text-black/40 dark:text-white/40">No exams added yet.</p>}
      </div>
    </ToolShell>
  );
}
