'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function SpinWheel() {
  const [optionsText, setOptionsText] = useState('Pizza\nSushi\nTacos\nBurgers\nSalad\nPasta');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const options = useMemo(
    () => optionsText.split('\n').map((o) => o.trim()).filter(Boolean).slice(0, 12),
    [optionsText]
  );

  const sliceAngle = 360 / Math.max(options.length, 1);

  function spin() {
    if (options.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * options.length);
    // Land the winner at the top pointer (0deg), with several full extra spins for effect.
    const targetSliceCenter = winnerIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation - (rotation % 360) + extraSpins * 360 + (360 - targetSliceCenter);

    setRotation(finalRotation);
    setTimeout(() => {
      setSpinning(false);
      setWinner(options[winnerIndex]);
    }, 4000);
  }

  return (
    <ToolShell outputValue={winner ?? undefined} shareSlug="spin-wheel">
      <div>
        <label className="mb-1 block text-sm font-medium">Options (one per line, up to 12)</label>
        <textarea
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative h-72 w-72 sm:h-80 sm:w-80">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rotate-180 border-x-[10px] border-b-[16px] border-x-transparent border-b-primary-500 drop-shadow" />
          </div>

          <motion.svg
            viewBox="0 0 200 200"
            className="h-full w-full drop-shadow-xl"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.17, 0.67, 0.24, 0.99] }}
          >
            {options.length >= 2 ? (
              options.map((opt, i) => {
                const start = i * sliceAngle;
                const end = start + sliceAngle;
                const mid = start + sliceAngle / 2;
                const labelPos = polarToCartesian(100, 100, 62, mid);
                return (
                  <g key={i}>
                    <path d={describeSlice(100, 100, 95, start, end)} fill={COLORS[i % COLORS.length]} stroke="#0B1120" strokeWidth={1} />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fill="white"
                      fontSize={options.length > 8 ? 7 : 9}
                      fontWeight={600}
                      textAnchor="middle"
                      transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {opt.length > 12 ? opt.slice(0, 11) + '…' : opt}
                    </text>
                  </g>
                );
              })
            ) : (
              <circle cx={100} cy={100} r={95} fill="#e5e7eb" />
            )}
            <circle cx={100} cy={100} r={10} fill="#0B1120" stroke="white" strokeWidth={2} />
          </motion.svg>
        </div>

        <Button size="lg" disabled={options.length < 2 || spinning} onClick={spin}>
          <Sparkles className="h-4 w-4" /> {spinning ? 'Spinning...' : 'Spin the wheel'}
        </Button>

        {winner && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="rounded-xl2 bg-gradient-brand px-6 py-3 text-center font-heading text-xl font-bold text-white shadow-glow"
          >
            🎉 {winner}
          </motion.div>
        )}
      </div>
    </ToolShell>
  );
}
