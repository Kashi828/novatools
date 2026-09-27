'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

const SAMPLE = `Reading speed varies a lot from person to person, and even for the same person depending on the material. Technical text is read more slowly than a novel. The average adult reads somewhere between 200 and 300 words per minute for straightforward material. Practicing with timed passages like this one is one of the simplest ways to get an honest measurement of your own pace, rather than relying on a generic estimate.`;

export function ReadingSpeedTracker() {
  const [text, setText] = useState(SAMPLE);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  function start() {
    setStartTime(Date.now());
    setWpm(null);
  }
  function finish() {
    if (!startTime) return;
    const minutes = (Date.now() - startTime) / 60000;
    setWpm(Math.round(wordCount / minutes));
    setStartTime(null);
  }

  return (
    <ToolShell outputValue={wpm !== null ? `${wpm} words per minute` : undefined} shareSlug="reading-speed-tracker">
      <div>
        <label className="mb-1 block text-sm font-medium">Text to read ({wordCount} words)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          disabled={startTime !== null}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 disabled:opacity-70 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex gap-2">
        {startTime === null ? (
          <Button size="lg" onClick={start}><Play className="h-4 w-4" /> Start reading</Button>
        ) : (
          <Button size="lg" variant="danger" onClick={finish}><Square className="h-4 w-4" /> I&rsquo;m done</Button>
        )}
      </div>

      {wpm !== null && (
        <div className="rounded-xl2 border border-primary-400/30 bg-primary-50 p-6 text-center dark:bg-primary-500/10">
          <div className="font-heading text-4xl font-bold text-primary-600 dark:text-primary-400">{wpm}</div>
          <div className="mt-1 text-sm text-black/50 dark:text-white/50">words per minute (average adult: 200-300)</div>
        </div>
      )}
    </ToolShell>
  );
}
