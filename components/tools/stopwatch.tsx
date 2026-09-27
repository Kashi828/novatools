'use client';

import { useEffect, useRef, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

function formatTime(ms: number) {
  const totalCentis = Math.floor(ms / 10);
  const minutes = Math.floor(totalCentis / 6000);
  const seconds = Math.floor((totalCentis % 6000) / 100);
  const centis = totalCentis % 100;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
}

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed;
    function tick() {
      setElapsed(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  return (
    <ToolShell outputValue={formatTime(elapsed)} shareSlug="stopwatch">
      <div className="flex flex-col items-center gap-6 py-6">
        <p className="font-mono text-5xl font-bold tabular-nums sm:text-6xl">{formatTime(elapsed)}</p>

        <div className="flex gap-2">
          {!running ? (
            <Button size="lg" onClick={() => setRunning(true)}>
              <Play className="h-4 w-4" /> {elapsed > 0 ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={() => setRunning(false)}>
              <Pause className="h-4 w-4" /> Pause
            </Button>
          )}
          <Button size="lg" variant="outline" disabled={!running} onClick={() => setLaps((prev) => [elapsed, ...prev])}>
            <Flag className="h-4 w-4" /> Lap
          </Button>
          <Button size="lg" variant="ghost" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="space-y-1.5">
          {laps.map((lap, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
              <span className="text-black/50 dark:text-white/50">Lap {laps.length - i}</span>
              <span className="font-mono">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
