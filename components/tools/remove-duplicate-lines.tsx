'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function RemoveDuplicateLines() {
  const [text, setText] = useState('apple\nbanana\napple\ncherry\nBanana');
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [sortOutput, setSortOutput] = useState(false);

  const { output, removedCount } = useMemo(() => {
    const lines = text.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];

    for (const raw of lines) {
      const line = trimLines ? raw.trim() : raw;
      const key = caseInsensitive ? line.toLowerCase() : line;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    if (sortOutput) result.sort((a, b) => a.localeCompare(b));
    return { output: result.join('\n'), removedCount: lines.length - result.length };
  }, [text, caseInsensitive, trimLines, sortOutput]);

  return (
    <ToolShell outputValue={output} downloadFilename="deduped.txt" onReset={() => setText('')} shareSlug="remove-duplicate-lines">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-primary-500" />
          Case-insensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="accent-primary-500" />
          Trim whitespace
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sortOutput} onChange={(e) => setSortOutput(e.target.checked)} className="accent-primary-500" />
          Sort output
        </label>
      </div>

      <p className="text-sm text-black/50 dark:text-white/50">Removed {removedCount} duplicate line{removedCount === 1 ? '' : 's'}.</p>

      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {output}
      </pre>
    </ToolShell>
  );
}
