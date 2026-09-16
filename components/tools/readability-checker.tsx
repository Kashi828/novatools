'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function countSyllables(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const matches = w.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 1;
  if (w.endsWith('e') && count > 1) count--;
  return Math.max(count, 1);
}

function fleschScore(text: string) {
  const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length || 1;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllableCount / wordCount);
  return { score, sentences, wordCount, syllableCount };
}

function interpret(score: number) {
  if (score >= 90) return { label: 'Very easy', desc: '5th grade level' };
  if (score >= 70) return { label: 'Easy', desc: '7th grade level' };
  if (score >= 60) return { label: 'Standard', desc: '8th-9th grade level' };
  if (score >= 50) return { label: 'Fairly difficult', desc: '10th-12th grade level' };
  if (score >= 30) return { label: 'Difficult', desc: 'College level' };
  return { label: 'Very difficult', desc: 'College graduate level' };
}

const SAMPLE = 'The quick brown fox jumps over the lazy dog. This simple sentence is often used to test typefaces because it contains every letter of the alphabet.';

export function ReadabilityChecker() {
  const [text, setText] = useState(SAMPLE);

  const result = useMemo(() => {
    if (!text.trim()) return null;
    const { score, sentences, wordCount, syllableCount } = fleschScore(text);
    return { score: Math.max(0, Math.min(100, score)), sentences, wordCount, syllableCount, ...interpret(score) };
  }, [text]);

  return (
    <ToolShell outputValue={result ? `Flesch Reading Ease: ${result.score.toFixed(1)} (${result.label})` : undefined} shareSlug="readability-checker">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Paste text to check its readability..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      {result && (
        <>
          <div className="rounded-xl2 border border-primary-400/30 bg-primary-50 p-6 text-center dark:bg-primary-500/10">
            <div className="font-heading text-4xl font-bold text-primary-600 dark:text-primary-400">{result.score.toFixed(1)}</div>
            <div className="mt-1 text-lg font-medium">{result.label}</div>
            <div className="text-sm text-black/50 dark:text-white/50">{result.desc}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-lg font-bold">{result.wordCount}</div>
              <div className="text-xs text-black/50 dark:text-white/50">Words</div>
            </div>
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-lg font-bold">{result.sentences}</div>
              <div className="text-xs text-black/50 dark:text-white/50">Sentences</div>
            </div>
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
              <div className="font-heading text-lg font-bold">{result.syllableCount}</div>
              <div className="text-xs text-black/50 dark:text-white/50">Syllables</div>
            </div>
          </div>
        </>
      )}
      <p className="text-xs text-black/40 dark:text-white/40">Uses the Flesch Reading Ease formula — a syllable-count estimate, not a linguistic analysis.</p>
    </ToolShell>
  );
}
