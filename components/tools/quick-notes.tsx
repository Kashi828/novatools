'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Save } from 'lucide-react';

const STORAGE_KEY = 'novatools-quick-notes';

export function QuickNotes() {
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setText(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, text);
      setSavedAt(new Date());
    }, 500);
    return () => clearTimeout(timeout);
  }, [text, loaded]);

  return (
    <ToolShell
      outputValue={text || undefined}
      downloadFilename="notes.txt"
      onReset={() => {
        setText('');
        window.localStorage.removeItem(STORAGE_KEY);
      }}
      shareSlug="quick-notes"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="Jot something down — it's saved automatically in this browser, on this device."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />
      <p className="flex items-center gap-1.5 text-xs text-black/40 dark:text-white/40">
        <Save className="h-3.5 w-3.5" />
        {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Not saved yet'} — stored only in this browser, never sent anywhere.
      </p>
    </ToolShell>
  );
}
