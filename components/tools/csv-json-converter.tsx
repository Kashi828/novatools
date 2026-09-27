'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && next === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}

const SAMPLE = 'name,age,city\nAda Lovelace,36,London\nAlan Turing,41,"Maida Vale, London"';

export function CsvJsonConverter() {
  const [csv, setCsv] = useState(SAMPLE);

  const { json, error } = useMemo(() => {
    try {
      const rows = parseCsv(csv);
      if (rows.length === 0) return { json: '[]', error: null as string | null };
      const [header, ...body] = rows;
      const objects = body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ''])));
      return { json: JSON.stringify(objects, null, 2), error: null };
    } catch {
      return { json: '', error: 'Could not parse this CSV.' };
    }
  }, [csv]);

  return (
    <ToolShell outputValue={json || undefined} downloadFilename="data.json" onReset={() => setCsv('')} shareSlug="csv-to-json">
      <div>
        <label className="mb-1 block text-sm font-medium">CSV input (first row = headers)</label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <pre className="max-h-72 overflow-auto rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
          {json}
        </pre>
      )}
    </ToolShell>
  );
}
