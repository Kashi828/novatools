'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

type DiffLine = { type: 'same' | 'added' | 'removed'; text: string };

function diffLines(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: 'same', text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'removed', text: a[i] });
      i++;
    } else {
      result.push({ type: 'added', text: b[j] });
      j++;
    }
  }
  while (i < n) result.push({ type: 'removed', text: a[i++] });
  while (j < m) result.push({ type: 'added', text: b[j++] });
  return result;
}

export function TextDiffChecker() {
  const [original, setOriginal] = useState('The quick brown fox\njumps over the lazy dog');
  const [changed, setChanged] = useState('The quick brown fox\njumps over the sleepy dog\nThe end.');

  const diff = useMemo(() => diffLines(original.split('\n'), changed.split('\n')), [original, changed]);
  const added = diff.filter((d) => d.type === 'added').length;
  const removed = diff.filter((d) => d.type === 'removed').length;

  return (
    <ToolShell shareSlug="text-diff-checker">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Original</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Changed</label>
          <textarea
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      <p className="text-sm text-black/50 dark:text-white/50">
        <span className="text-success">+{added} added</span> · <span className="text-danger">-{removed} removed</span>
      </p>

      <div className="max-h-96 overflow-auto rounded-xl border border-black/10 font-mono text-sm dark:border-white/10">
        {diff.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'added'
                ? 'bg-success/10 px-3 py-1 text-success'
                : line.type === 'removed'
                ? 'bg-danger/10 px-3 py-1 text-danger'
                : 'px-3 py-1'
            }
          >
            {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
            {line.text || ' '}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
