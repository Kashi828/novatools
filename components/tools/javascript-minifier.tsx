'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

const SAMPLE = `function greet(name) {\n  // say hello\n  const message = \`Hello, \${name}!\`;\n  console.log(message);\n}\n`;

function minifyJs(code: string) {
  let out = '';
  let i = 0;
  const n = code.length;

  while (i < n) {
    const ch = code[i];
    const next = code[i + 1];

    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      out += ch;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < n) {
          out += code[i] + code[i + 1];
          i += 2;
        } else {
          out += code[i];
          i++;
        }
      }
      if (i < n) {
        out += code[i];
        i++;
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      while (i < n && code[i] !== '\n') i++;
      continue;
    }

    if (ch === '/' && next === '*') {
      i += 2;
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    out += ch;
    i++;
  }

  return out
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .replace(/[ \t]+/g, ' ');
}

export function JavascriptMinifier() {
  const [input, setInput] = useState(SAMPLE);
  const output = useMemo(() => minifyJs(input), [input]);
  const saved = input.length ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <ToolShell outputValue={output} downloadFilename="script.min.js" onReset={() => setInput('')} shareSlug="javascript-minifier">
      <div>
        <label className="mb-1 block text-sm font-medium">JavaScript input</label>
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

      <p className="text-xs text-black/40 dark:text-white/40">
        This strips comments and extra whitespace only — it&rsquo;s safe but not as small as a real bundler-grade minifier
        like Terser or esbuild, which also rename variables and remove dead code.
      </p>
    </ToolShell>
  );
}
