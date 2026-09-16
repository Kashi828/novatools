'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

const SAMPLE = `.card {\n  background: #fff;\n  /* rounded corners */\n  border-radius: 12px;\n  padding: 16px;\n}\n`;

function minifyCss(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

export function CssMinifier() {
  const [input, setInput] = useState(SAMPLE);
  const output = useMemo(() => minifyCss(input), [input]);
  const saved = input.length ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <ToolShell outputValue={output} downloadFilename="styles.min.css" onReset={() => setInput('')} shareSlug="css-minifier">
      <div>
        <label className="mb-1 block text-sm font-medium">CSS input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <p className="text-sm text-black/50 dark:text-white/50">
        {input.length.toLocaleString()} → {output.length.toLocaleString()} characters ({saved}% smaller)
      </p>

      <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-black/10 bg-black/[0.02] p-3 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {output}
      </pre>
    </ToolShell>
  );
}
