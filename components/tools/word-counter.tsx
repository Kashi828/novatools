'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
    const readingMinutes = words / 200;
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingMinutes };
  }, [text]);

  return (
    <ToolShell
      outputValue={`Words: ${stats.words}, Characters: ${stats.chars}, Sentences: ${stats.sentences}`}
      onReset={() => setText('')}
      shareSlug="word-counter"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Paste or type your text here..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No spaces', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-black/10 bg-black/[0.02] p-3 text-center dark:border-white/10 dark:bg-white/5">
            <div className="font-heading text-xl font-bold">{s.value}</div>
            <div className="text-xs text-black/50 dark:text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-black/50 dark:text-white/50">
        Estimated reading time: {stats.readingMinutes < 1 ? '< 1 min' : `${Math.ceil(stats.readingMinutes)} min`}
      </p>
    </ToolShell>
  );
}
