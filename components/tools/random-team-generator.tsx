'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function RandomTeamGenerator() {
  const [namesText, setNamesText] = useState('Ava\nLiam\nMaya\nNoah\nZara\nKai\nElla\nOmar');
  const [teamCount, setTeamCount] = useState(2);
  const [seed, setSeed] = useState(0);

  const names = useMemo(() => namesText.split('\n').map((n) => n.trim()).filter(Boolean), [namesText]);

  const teams = useMemo(() => {
    const shuffled = shuffle(names);
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => result[i % teamCount].push(name));
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names, teamCount, seed]);

  const outputValue = teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n');

  return (
    <ToolShell outputValue={outputValue} downloadFilename="teams.txt" shareSlug="random-team-generator">
      <div>
        <label className="mb-1 block text-sm font-medium">Names (one per line)</label>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Number of teams</label>
        <input
          type="number"
          min={2}
          max={Math.max(2, names.length)}
          value={teamCount}
          onChange={(e) => setTeamCount(Math.max(2, Number(e.target.value)))}
          className="w-20 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
        <Button size="sm" onClick={() => setSeed((s) => s + 1)}>
          <Shuffle className="h-4 w-4" /> Shuffle
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {teams.map((team, i) => (
          <div key={i} className="rounded-xl2 border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-2 font-heading font-semibold">Team {i + 1}</h3>
            <ul className="space-y-1 text-sm text-black/70 dark:text-white/70">
              {team.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
