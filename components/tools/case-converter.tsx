'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

function toTitleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function toSentenceCase(s: string) {
  const lower = s.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}
function words(s: string) {
  return s.trim().split(/[\s_-]+|(?=[A-Z])/).filter(Boolean).map((w) => w.toLowerCase());
}
function toCamelCase(s: string) {
  const w = words(s);
  return w.map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))).join('');
}
function toPascalCase(s: string) {
  return words(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
function toSnakeCase(s: string) {
  return words(s).join('_');
}
function toKebabCase(s: string) {
  return words(s).join('-');
}
function toConstantCase(s: string) {
  return words(s).join('_').toUpperCase();
}

const TRANSFORMS: { label: string; fn: (s: string) => string }[] = [
  { label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { label: 'lowercase', fn: (s) => s.toLowerCase() },
  { label: 'Title Case', fn: toTitleCase },
  { label: 'Sentence case', fn: toSentenceCase },
  { label: 'camelCase', fn: toCamelCase },
  { label: 'PascalCase', fn: toPascalCase },
  { label: 'snake_case', fn: toSnakeCase },
  { label: 'kebab-case', fn: toKebabCase },
  { label: 'CONSTANT_CASE', fn: toConstantCase },
];

export function CaseConverter() {
  const [text, setText] = useState('The Quick Brown Fox Jumps Over The Lazy Dog');
  const [active, setActive] = useState(0);

  const output = useMemo(() => TRANSFORMS[active].fn(text), [text, active]);

  return (
    <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="case-converter">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex flex-wrap gap-2">
        {TRANSFORMS.map((t, i) => (
          <Button key={t.label} size="sm" variant={active === i ? 'primary' : 'outline'} onClick={() => setActive(i)}>
            {t.label}
          </Button>
        ))}
      </div>

      <pre className="whitespace-pre-wrap break-words rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/5">
        {output}
      </pre>
    </ToolShell>
  );
}
