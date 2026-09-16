'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function WordGoalTracker() {
  const [text, setText] = useState('');
  const [goal, setGoal] = useState(500);

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const percent = Math.min(100, Math.round((wordCount / goal) * 100));

  return (
    <ToolShell outputValue={`${wordCount} / ${goal} words (${percent}%)`} onReset={() => setText('')} shareSlug="word-goal-tracker">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Word goal</label>
        <input type="number" min={1} value={goal} onChange={(e) => setGoal(Math.max(1, Number(e.target.value)))} className="w-28 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Paste or write your essay draft here..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>{wordCount} words</span>
          <span>{percent}% of {goal}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className={`h-full rounded-full transition-all ${percent >= 100 ? 'bg-success' : 'bg-gradient-brand'}`} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {percent >= 100 && <p className="text-center text-sm font-medium text-success">🎉 Goal reached!</p>}
    </ToolShell>
  );
}
