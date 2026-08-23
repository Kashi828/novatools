'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

type Alignment = 'left' | 'center' | 'right';

export function MarkdownTableGenerator() {
  const [headers, setHeaders] = useState(['Name', 'Role', 'Location']);
  const [rows, setRows] = useState([
    ['Ada Lovelace', 'Mathematician', 'London'],
    ['Alan Turing', 'Computer Scientist', 'Maida Vale'],
  ]);
  const [alignment, setAlignment] = useState<Alignment>('left');

  function updateHeader(i: number, value: string) {
    setHeaders((prev) => prev.map((h, idx) => (idx === i ? value : h)));
  }
  function updateCell(r: number, c: number, value: string) {
    setRows((prev) => prev.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row)));
  }
  function addColumn() {
    setHeaders((prev) => [...prev, `Column ${prev.length + 1}`]);
    setRows((prev) => prev.map((row) => [...row, '']));
  }
  function removeColumn() {
    if (headers.length <= 1) return;
    setHeaders((prev) => prev.slice(0, -1));
    setRows((prev) => prev.map((row) => row.slice(0, -1)));
  }
  function addRow() {
    setRows((prev) => [...prev, headers.map(() => '')]);
  }
  function removeRow() {
    setRows((prev) => prev.slice(0, -1));
  }

  const markdown = useMemo(() => {
    const sep = alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : ':---';
    const headerLine = `| ${headers.join(' | ')} |`;
    const sepLine = `| ${headers.map(() => sep).join(' | ')} |`;
    const rowLines = rows.map((r) => `| ${r.join(' | ')} |`);
    return [headerLine, sepLine, ...rowLines].join('\n');
  }, [headers, rows, alignment]);

  return (
    <ToolShell outputValue={markdown} downloadFilename="table.md" shareSlug="markdown-table-generator">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={addColumn}><Plus className="h-3.5 w-3.5" /> Column</Button>
        <Button size="sm" variant="outline" onClick={removeColumn}><Minus className="h-3.5 w-3.5" /> Column</Button>
        <Button size="sm" variant="outline" onClick={addRow}><Plus className="h-3.5 w-3.5" /> Row</Button>
        <Button size="sm" variant="outline" onClick={removeRow}><Minus className="h-3.5 w-3.5" /> Row</Button>
        {(['left', 'center', 'right'] as Alignment[]).map((a) => (
          <Button key={a} size="sm" variant={alignment === a ? 'primary' : 'outline'} onClick={() => setAlignment(a)}>
            {a}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border-b border-black/10 p-2 dark:border-white/10">
                  <input value={h} onChange={(e) => updateHeader(i, e.target.value)} className="w-full bg-transparent font-semibold outline-none" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border-b border-black/5 p-2 dark:border-white/5">
                    <input value={cell} onChange={(e) => updateCell(r, c, e.target.value)} className="w-full bg-transparent outline-none" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <pre className="overflow-auto rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {markdown}
      </pre>
    </ToolShell>
  );
}
