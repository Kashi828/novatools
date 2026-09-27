'use client';

import { useEffect, useRef, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const PHASES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

export function StudyTimer() {
  const [phase, setPhase] = useState<'focus' | 'short' | 'long'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(PHASES.focus);
  const [running, setRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      playChime();
      if (phase === 'focus') {
        const nextCycles = cyclesCompleted + 1;
        setCyclesCompleted(nextCycles);
        const next = nextCycles % 4 === 0 ? 'long' : 'short';
        setPhase(next);
        setSecondsLeft(PHASES[next]);
      } else {
        setPhase('focus');
        setSecondsLeft(PHASES.focus);
      }
      return;
    }
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [running, secondsLeft, phase, cyclesCompleted]);

  function playChime() {
    try {
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio not available — silently skip the chime.
    }
  }

  function reset() {
    setRunning(false);
    setPhase('focus');
    setSecondsLeft(PHASES.focus);
  }

  function switchPhase(p: 'focus' | 'short' | 'long') {
    setRunning(false);
    setPhase(p);
    setSecondsLeft(PHASES[p]);
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <ToolShell outputValue={`${minutes}:${seconds} (${phase})`} shareSlug="study-timer">
      <div className="flex gap-2">
        <Button size="sm" variant={phase === 'focus' ? 'primary' : 'outline'} onClick={() => switchPhase('focus')}>Focus (25m)</Button>
        <Button size="sm" variant={phase === 'short' ? 'primary' : 'outline'} onClick={() => switchPhase('short')}>Short break (5m)</Button>
        <Button size="sm" variant={phase === 'long' ? 'primary' : 'outline'} onClick={() => switchPhase('long')}>Long break (15m)</Button>
      </div>

      <div className="flex flex-col items-center gap-4 py-6">
        <p className="font-mono text-6xl font-bold tabular-nums">{minutes}:{seconds}</p>
        <p className="text-sm text-black/50 dark:text-white/50">{cyclesCompleted} focus session{cyclesCompleted === 1 ? '' : 's'} completed today</p>
        <div className="flex gap-2">
          {!running ? (
            <Button size="lg" onClick={() => setRunning(true)}><Play className="h-4 w-4" /> Start</Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={() => setRunning(false)}><Pause className="h-4 w-4" /> Pause</Button>
          )}
          <Button size="lg" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
        </div>
      </div>
    </ToolShell>
  );
}
