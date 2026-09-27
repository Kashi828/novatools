'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

export function CoinFlip() {
  const [result, setResult] = useState<'heads' | 'tails'>('heads');
  const [flipping, setFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);

  function flip() {
    if (flipping) return;
    setFlipping(true);
    const outcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
    setFlipCount((c) => c + 1);
    setTimeout(() => {
      setResult(outcome);
      setHistory((prev) => [outcome, ...prev].slice(0, 10));
      setFlipping(false);
    }, 700);
  }

  return (
    <ToolShell outputValue={`${result} (${history.length} flips so far)`} shareSlug="coin-flip">
      <div className="flex flex-col items-center gap-6 py-6" style={{ perspective: 800 }}>
        <motion.div
          animate={flipping ? { rotateY: [0, 720 + (result === 'tails' ? 180 : 0)] } : { rotateY: result === 'tails' ? 180 : 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-32 w-32"
        >
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-white shadow-glow"
          >
            HEADS
          </div>
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-primary-400 bg-white text-lg font-bold text-primary-600 shadow-glow dark:bg-[#0F1729]"
          >
            TAILS
          </div>
        </motion.div>

        <Button size="lg" disabled={flipping} onClick={flip}>
          {flipping ? 'Flipping...' : 'Flip the coin'}
        </Button>
      </div>

      {history.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Recent flips</p>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  h === 'heads' ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
