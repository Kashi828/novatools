'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function TextReverser() {
  const [text, setText] = useState('A man, a plan, a canal, Panama!');

  const reversed = useMemo(() => text.split('').reverse().join(''), [text]);
  const isPalindrome = useMemo(() => {
    const n = normalize(text);
    return n.length > 0 && n === n.split('').reverse().join('');
  }, [text]);

  return (
    <ToolShell outputValue={reversed} onReset={() => setText('')} shareSlug="text-reverser">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {reversed || '—'}
      </div>

      <div className={`rounded-xl border p-3 text-center text-sm font-medium ${isPalindrome ? 'border-success/30 bg-success/5 text-success' : 'border-black/10 bg-black/[0.02] text-black/50 dark:border-white/10 dark:bg-white/5 dark:text-white/50'}`}>
        {isPalindrome ? '✓ This is a palindrome!' : 'Not a palindrome'}
      </div>
    </ToolShell>
  );
}
