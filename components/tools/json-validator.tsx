'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { CheckCircle2, XCircle } from 'lucide-react';

function locateError(input: string, message: string) {
  const match = message.match(/position (\d+)/);
  if (!match) return null;
  const pos = Number(match[1]);
  const upToError = input.slice(0, pos);
  const line = upToError.split('\n').length;
  const column = pos - upToError.lastIndexOf('\n');
  return { line, column };
}

export function JsonValidator() {
  const [input, setInput] = useState('{\n  "valid": true\n}');

  const validation = useMemo(() => {
    if (!input.trim()) return { valid: false, message: 'Empty input', location: null as { line: number; column: number } | null };
    try {
      JSON.parse(input);
      return { valid: true, message: 'Valid JSON', location: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      return { valid: false, message, location: locateError(input, message) };
    }
  }, [input]);

  return (
    <ToolShell onReset={() => setInput('')} shareSlug="json-validator">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        spellCheck={false}
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div
        className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
          validation.valid
            ? 'border-success/30 bg-success/5 text-success'
            : 'border-danger/30 bg-danger/5 text-danger'
        }`}
      >
        {validation.valid ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
        <div>
          <p className="font-medium">{validation.valid ? 'Valid JSON' : 'Invalid JSON'}</p>
          {!validation.valid && <p className="mt-0.5 opacity-80">{validation.message}</p>}
          {validation.location && (
            <p className="mt-0.5 opacity-80">
              Around line {validation.location.line}, column {validation.location.column}
            </p>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
