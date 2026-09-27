'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

const SAMPLE = '{\n  "name": "NovaTools",\n  "free": true,\n  "tools": 200\n}';

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(2);

  const { formatted, error } = useMemo(() => {
    if (!input.trim()) return { formatted: '', error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return { formatted: JSON.stringify(parsed, null, indent), error: null };
    } catch (e) {
      return { formatted: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }, [input, indent]);

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {
      /* leave as is, error already shown */
    }
  }

  return (
    <ToolShell outputValue={formatted || undefined} downloadFilename="formatted.json" onReset={() => setInput('')} shareSlug="json-formatter">
      <div>
        <label className="mb-1 block text-sm font-medium">Paste JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={indent === 2 ? 'primary' : 'outline'} onClick={() => setIndent(2)}>
          2-space
        </Button>
        <Button size="sm" variant={indent === 4 ? 'primary' : 'outline'} onClick={() => setIndent(4)}>
          4-space
        </Button>
        <Button size="sm" variant="outline" onClick={minify}>
          Minify
        </Button>
        {error ? (
          <span className="text-sm text-danger">Invalid JSON — {error}</span>
        ) : formatted ? (
          <span className="text-sm text-success">Valid JSON</span>
        ) : null}
      </div>

      {formatted && (
        <pre className="max-h-80 overflow-auto rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
          {formatted}
        </pre>
      )}
    </ToolShell>
  );
}
