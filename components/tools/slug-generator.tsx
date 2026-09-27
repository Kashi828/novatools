'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

function slugify(text: string, separator: string, lowercase: boolean) {
  let result = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, separator);
  if (lowercase) result = result.toLowerCase();
  return result;
}

export function SlugGenerator() {
  const [text, setText] = useState("What's the Best Pizza in New York? (2026 Guide)");
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);

  const slug = useMemo(() => slugify(text, separator, lowercase), [text, separator, lowercase]);

  return (
    <ToolShell outputValue={slug} onReset={() => setText('')} shareSlug="slug-generator">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <Button size="sm" variant={separator === '-' ? 'primary' : 'outline'} onClick={() => setSeparator('-')}>-</Button>
          <Button size="sm" variant={separator === '_' ? 'primary' : 'outline'} onClick={() => setSeparator('_')}>_</Button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="accent-primary-500" />
          lowercase
        </label>
      </div>

      <pre className="break-all rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {slug}
      </pre>
    </ToolShell>
  );
}
