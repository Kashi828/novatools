'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

interface Stop {
  color: string;
  pos: number;
}

export function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: '#6366F1', pos: 0 },
    { color: '#06B6D4', pos: 100 },
  ]);

  const css = useMemo(() => {
    const stopStr = stops.map((s) => `${s.color} ${s.pos}%`).join(', ');
    return type === 'linear' ? `linear-gradient(${angle}deg, ${stopStr})` : `radial-gradient(circle, ${stopStr})`;
  }, [type, angle, stops]);

  function updateStop(i: number, patch: Partial<Stop>) {
    setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addStop() {
    if (stops.length >= 5) return;
    setStops((prev) => [...prev, { color: '#8B5CF6', pos: 50 }]);
  }

  function removeStop(i: number) {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <ToolShell outputValue={`background: ${css};`} onReset={() => setStops([{ color: '#6366F1', pos: 0 }, { color: '#06B6D4', pos: 100 }])} shareSlug="gradient-generator">
      <div className="h-40 w-full rounded-xl2 border border-black/10 dark:border-white/10" style={{ background: css }} />

      <div className="flex gap-2">
        <Button size="sm" variant={type === 'linear' ? 'primary' : 'outline'} onClick={() => setType('linear')}>
          Linear
        </Button>
        <Button size="sm" variant={type === 'radial' ? 'primary' : 'outline'} onClick={() => setType('radial')}>
          Radial
        </Button>
      </div>

      {type === 'linear' && (
        <div>
          <div className="mb-1 flex justify-between text-sm"><span>Angle</span><span>{angle}°</span></div>
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-primary-500" />
        </div>
      )}

      <div className="space-y-3">
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3">
            <input type="color" value={stop.color} onChange={(e) => updateStop(i, { color: e.target.value })} className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-black/10 dark:border-white/10" />
            <input
              type="range"
              min={0}
              max={100}
              value={stop.pos}
              onChange={(e) => updateStop(i, { pos: Number(e.target.value) })}
              className="flex-1 accent-primary-500"
            />
            <span className="w-10 text-right text-xs text-black/50 dark:text-white/50">{stop.pos}%</span>
            {stops.length > 2 && (
              <button onClick={() => removeStop(i)} className="text-xs text-danger">
                Remove
              </button>
            )}
          </div>
        ))}
        {stops.length < 5 && (
          <Button size="sm" variant="outline" onClick={addStop}>
            + Add color stop
          </Button>
        )}
      </div>

      <pre className="rounded-xl border border-black/10 bg-black/[0.02] p-3 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        background: {css};
      </pre>
    </ToolShell>
  );
}
