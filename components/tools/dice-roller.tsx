'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

const PIP_LAYOUTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <motion.div
      animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] } : { rotate: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-16 w-16 rounded-2xl border border-black/10 bg-white shadow-glass dark:border-white/10 dark:bg-white/10"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {PIP_LAYOUTS[value].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={8} className="fill-primary-500" />
        ))}
      </svg>
    </motion.div>
  );
}

export function DiceRoller() {
  const [diceCount, setDiceCount] = useState(2);
  const [values, setValues] = useState<number[]>([4, 6]);
  const [rolling, setRolling] = useState(false);

  function roll() {
    setRolling(true);
    setTimeout(() => {
      setValues(Array.from({ length: diceCount }, () => 1 + Math.floor(Math.random() * 6)));
      setRolling(false);
    }, 600);
  }

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <ToolShell outputValue={`Rolled: ${values.join(', ')} (total ${total})`} shareSlug="dice-roller">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Number of dice</label>
        <input
          type="number"
          min={1}
          max={6}
          value={diceCount}
          onChange={(e) => setDiceCount(Math.min(6, Math.max(1, Number(e.target.value))))}
          className="w-20 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 py-6">
        {values.slice(0, diceCount).map((v, i) => (
          <Die key={i} value={v} rolling={rolling} />
        ))}
      </div>

      <div className="text-center">
        <p className="font-heading text-2xl font-bold">Total: {total}</p>
      </div>

      <Button size="lg" className="w-full" disabled={rolling} onClick={roll}>
        {rolling ? 'Rolling...' : 'Roll'}
      </Button>
    </ToolShell>
  );
}
