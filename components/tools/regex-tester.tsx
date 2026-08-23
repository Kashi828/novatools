'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function RegexTester() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Contact us at hello@novatools.app or support@example.com.');

  const { matches, error, highlighted } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const found: RegExpExecArray[] = [];
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = re.exec(testString)) !== null && guard < 1000) {
        found.push(m);
        if (m[0] === '') re.lastIndex++;
        guard++;
      }

      const parts: { text: string; match: boolean }[] = [];
      let lastIndex = 0;
      for (const match of found) {
        if (match.index > lastIndex) parts.push({ text: testString.slice(lastIndex, match.index), match: false });
        parts.push({ text: match[0], match: true });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < testString.length) parts.push({ text: testString.slice(lastIndex), match: false });

      return { matches: found, error: null as string | null, highlighted: parts };
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex', highlighted: [{ text: testString, match: false }] };
    }
  }, [pattern, flags, testString]);

  return (
    <ToolShell onReset={() => setTestString('')} shareSlug="regex-tester">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Pattern</label>
          <div className="flex items-center rounded-xl border border-black/10 bg-white/60 px-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-black/30 dark:text-white/30">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className="w-full bg-transparent py-3 px-1 font-mono text-sm outline-none"
            />
            <span className="text-black/30 dark:text-white/30">/{flags}</span>
          </div>
        </div>
        <div className="w-24">
          <label className="mb-1 block text-sm font-medium">Flags</label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Test string</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <>
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-white/5">
            {highlighted.map((part, i) =>
              part.match ? (
                <mark key={i} className="rounded bg-primary-400/30 px-0.5 text-inherit">
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
          <p className="text-sm text-black/50 dark:text-white/50">
            {matches.length} match{matches.length === 1 ? '' : 'es'}
          </p>
        </>
      )}
    </ToolShell>
  );
}
