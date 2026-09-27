'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

export function UrlTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('https://novatools.app/search?q=free tools & more');

  const { output, error } = useMemo(() => {
    try {
      return {
        output: mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input),
        error: null as string | null,
      };
    } catch {
      return { output: '', error: 'Invalid input for this mode' };
    }
  }, [input, mode]);

  return (
    <ToolShell outputValue={output || undefined} onReset={() => setInput('')} shareSlug="url-encoder-decoder">
      <div className="flex gap-2">
        <Button size="sm" variant={mode === 'encode' ? 'primary' : 'outline'} onClick={() => setMode('encode')}>
          Encode
        </Button>
        <Button size="sm" variant={mode === 'decode' ? 'primary' : 'outline'} onClick={() => setMode('decode')}>
          Decode
        </Button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-black/10 bg-black/[0.02] p-3 font-mono text-sm dark:border-white/10 dark:bg-white/5">
          {output}
        </pre>
      )}
    </ToolShell>
  );
}
