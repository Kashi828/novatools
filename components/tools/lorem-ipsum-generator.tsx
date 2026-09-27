'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

const WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna ' +
  'aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure ' +
  'in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident ' +
  'sunt culpa qui officia deserunt mollit anim id est laborum').split(' ');

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function makeSentence() {
  const length = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length }, randomWord);
  return capitalize(words.join(' ')) + '.';
}

function makeParagraph() {
  const sentences = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentences }, makeSentence).join(' ');
}

type Mode = 'words' | 'sentences' | 'paragraphs';

export function LoremIpsumGenerator() {
  const [mode, setMode] = useState<Mode>('paragraphs');
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    if (mode === 'words') return Array.from({ length: count }, randomWord).join(' ');
    if (mode === 'sentences') return Array.from({ length: count }, makeSentence).join(' ');
    return Array.from({ length: count }, makeParagraph).join('\n\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, seed]);

  return (
    <ToolShell outputValue={output} downloadFilename="lorem-ipsum.txt" onReset={() => setSeed((s) => s + 1)} shareSlug="lorem-ipsum-generator">
      <div className="flex flex-wrap gap-2">
        {(['words', 'sentences', 'paragraphs'] as Mode[]).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? 'primary' : 'outline'} onClick={() => setMode(m)}>
            {capitalize(m)}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Count</label>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
          className="w-24 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        <Button size="sm" onClick={() => setSeed((s) => s + 1)}>Regenerate</Button>
      </div>

      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/5">
        {output}
      </pre>
    </ToolShell>
  );
}
