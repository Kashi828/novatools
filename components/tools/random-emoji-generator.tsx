'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const EMOJI_SETS: Record<string, string[]> = {
  Faces: ['😀', '😂', '🥹', '😎', '🤔', '😴', '🥳', '😇', '🤩', '😅', '🙃', '😏'],
  Animals: ['🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐸', '🐧', '🦄', '🐢', '🦋', '🐙'],
  Food: ['🍕', '🍔', '🍣', '🍩', '🍦', '🥐', '🍇', '🍉', '🌮', '🍪', '🥑', '🍰'],
  Nature: ['🌸', '🌵', '🌈', '🔥', '❄️', '🌊', '⭐', '🌙', '🍀', '🌻', '🍁', '⚡'],
  Objects: ['💎', '🎈', '🎁', '🚀', '🎨', '📚', '🎧', '⚽', '🎮', '🧩', '🔑', '💡'],
};

export function RandomEmojiGenerator() {
  const [category, setCategory] = useState<keyof typeof EMOJI_SETS>('Faces');
  const [count, setCount] = useState(5);
  const [emojis, setEmojis] = useState<string[]>([]);

  function generate() {
    const pool = EMOJI_SETS[category];
    setEmojis(Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]));
  }

  return (
    <ToolShell outputValue={emojis.join(' ')} shareSlug="random-emoji-generator">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EMOJI_SETS) as (keyof typeof EMOJI_SETS)[]).map((c) => (
          <Button key={c} size="sm" variant={category === c ? 'primary' : 'outline'} onClick={() => setCategory(c)}>
            {c}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">How many?</label>
        <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))} className="w-20 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <Button size="sm" onClick={generate}>
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl2 border border-black/10 bg-black/[0.02] p-6 text-4xl dark:border-white/10 dark:bg-white/5">
        {emojis.length ? emojis.map((e, i) => <span key={i}>{e}</span>) : <span className="text-sm text-black/40 dark:text-white/40">Click generate to see emojis</span>}
      </div>
    </ToolShell>
  );
}
