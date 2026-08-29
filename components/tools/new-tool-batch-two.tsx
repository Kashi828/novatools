'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

const field = 'w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5';

export function TextCleaner() {
  const [text, setText] = useState('');
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(false);
  const [collapseSpaces, setCollapseSpaces] = useState(false);
  const output = useMemo(() => {
    let lines = text.split(/\r?\n/);
    if (trimLines) lines = lines.map((line) => line.trim());
    if (collapseSpaces) lines = lines.map((line) => line.replace(/[ \t]+/g, ' '));
    if (removeBlank) lines = lines.filter(Boolean);
    return lines.join('\n');
  }, [text, trimLines, removeBlank, collapseSpaces]);
  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="text-cleaner">
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={11} placeholder="Paste messy text..." className={field} /><textarea value={output} readOnly rows={11} className={field} /></div>
    <div className="flex flex-wrap gap-4 text-sm">{[[trimLines,setTrimLines,'Trim each line'],[removeBlank,setRemoveBlank,'Remove blank lines'],[collapseSpaces,setCollapseSpaces,'Collapse repeated spaces']] .map(([checked,setter,label]) => <label key={String(label)} className="flex items-center gap-2"><input type="checkbox" checked={checked as boolean} onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)} className="accent-primary-500" />{String(label)}</label>)}</div>
  </ToolShell>;
}

export function WordFrequencyCounter() {
  const [text, setText] = useState('');
  const rows = useMemo(() => {
    const words = text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
    const counts = new Map<string, number>();
    words.forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 30);
  }, [text]);
  const output = rows.map(([word, count]) => `${word}: ${count}`).join('\n');
  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="word-frequency-counter">
    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste text to find its most frequent words..." className={field} />
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">{rows.length ? <table className="w-full text-sm"><thead className="bg-black/[.03] text-left dark:bg-white/5"><tr><th className="px-4 py-2">Word</th><th className="px-4 py-2">Count</th></tr></thead><tbody>{rows.map(([word,count]) => <tr key={word} className="border-t border-black/5 dark:border-white/10"><td className="px-4 py-2">{word}</td><td className="px-4 py-2 font-medium">{count}</td></tr>)}</tbody></table> : <p className="p-5 text-sm text-black/50 dark:text-white/50">Your frequency list will appear here.</p>}</div>
  </ToolShell>;
}

function toCsv(rows: Record<string, unknown>[]) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const quote = (value: unknown) => '"' + String(value ?? '').replace(/"/g, '""') + '"';
  return [headers.join(','), ...rows.map((row) => headers.map((header) => quote(row[header])).join(','))].join('\n');
}

export function JsonToCsvConverter() {
  const [input, setInput] = useState('[\n  { "name": "NovaTools", "type": "website" }\n]');
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      if (!rows.every((row) => row && typeof row === 'object' && !Array.isArray(row))) return { error: 'Use a JSON object or an array of JSON objects.', csv: '' };
      return { error: '', csv: toCsv(rows as Record<string, unknown>[]) };
    } catch { return { error: 'Invalid JSON. Check commas, quotes, and brackets.', csv: '' }; }
  }, [input]);
  return <ToolShell outputValue={result.csv || undefined} downloadFilename="data.csv" onReset={() => setInput('')} shareSlug="json-to-csv-converter">
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className={field} /><textarea value={result.csv} readOnly rows={12} className={field} /></div>{result.error && <p className="text-sm text-danger">{result.error}</p>}
  </ToolShell>;
}

function parseCsvLine(line: string) {
  const fields: string[] = []; let value = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { fields.push(value); value = ''; }
    else value += char;
  }
  fields.push(value); return fields;
}

export function CsvColumnExtractor() {
  const [csv, setCsv] = useState('name,email,role\nAsha,asha@example.com,Editor\nRavi,ravi@example.com,Admin');
  const [column, setColumn] = useState('0');
  const result = useMemo(() => {
    const lines = csv.split(/\r?\n/).filter(Boolean).map(parseCsvLine);
    const index = Math.max(0, Number(column) || 0);
    return lines.map((row) => row[index] ?? '').join('\n');
  }, [csv, column]);
  return <ToolShell outputValue={result} downloadFilename="column.txt" onReset={() => setCsv('')} shareSlug="csv-column-extractor">
    <label className="block max-w-xs text-sm font-medium">Column number (first column is 0)<input type="number" min="0" value={column} onChange={(e) => setColumn(e.target.value)} className={field} /></label>
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={10} className={field} /><textarea value={result} readOnly rows={10} className={field} /></div>
  </ToolShell>;
}

export function PercentageChangeCalculator() {
  const [oldValue, setOldValue] = useState('100');
  const [newValue, setNewValue] = useState('120');
  const result = useMemo(() => { const oldNumber = Number(oldValue), newNumber = Number(newValue); return Number.isFinite(oldNumber) && Number.isFinite(newNumber) && oldNumber !== 0 ? ((newNumber - oldNumber) / Math.abs(oldNumber)) * 100 : null; }, [oldValue, newValue]);
  return <ToolShell outputValue={result === null ? undefined : `${result.toFixed(2)}%`} onReset={() => { setOldValue(''); setNewValue(''); }} shareSlug="percentage-change-calculator">
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Original value<input type="number" value={oldValue} onChange={(e) => setOldValue(e.target.value)} className={field} /></label><label className="text-sm font-medium">New value<input type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} className={field} /></label></div>
    <div className="rounded-xl2 bg-black/[.02] p-6 text-center dark:bg-white/5">{result === null ? <p className="text-sm text-danger">Enter a non-zero original value.</p> : <><div className={`font-heading text-4xl font-bold ${result >= 0 ? 'text-success' : 'text-danger'}`}>{result >= 0 ? '+' : ''}{result.toFixed(2)}%</div><p className="mt-1 text-sm text-black/50 dark:text-white/50">{result >= 0 ? 'increase' : 'decrease'}</p></>}</div>
  </ToolShell>;
}

export function DiscountCalculator() {
  const [price, setPrice] = useState('1000');
  const [discount, setDiscount] = useState('20');
  const [tax, setTax] = useState('0');
  const values = useMemo(() => { const list=[Number(price),Number(discount),Number(tax)]; if(list.some((n)=>!Number.isFinite(n)))return null; const saved=list[0]*list[1]/100; const after=list[0]-saved; return {saved, after, total:after*(1+list[2]/100)}; },[price,discount,tax]);
  return <ToolShell outputValue={values ? `Final price: ${values.total.toFixed(2)}` : undefined} onReset={() => { setPrice(''); setDiscount(''); setTax('0'); }} shareSlug="discount-calculator">
    <div className="grid gap-3 sm:grid-cols-3"><label className="text-sm font-medium">Original price<input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className={field} /></label><label className="text-sm font-medium">Discount %<input type="number" value={discount} onChange={(e)=>setDiscount(e.target.value)} className={field} /></label><label className="text-sm font-medium">Tax after discount %<input type="number" value={tax} onChange={(e)=>setTax(e.target.value)} className={field} /></label></div>
    {values && <div className="grid grid-cols-3 gap-3">{[['You save',values.saved],['After discount',values.after],['Final total',values.total]].map(([label,value])=><div key={String(label)} className="rounded-xl border border-black/10 bg-black/[.02] p-4 text-center dark:border-white/10 dark:bg-white/5"><div className="font-heading text-xl font-bold">{Number(value).toFixed(2)}</div><div className="text-xs text-black/50 dark:text-white/50">{String(label)}</div></div>)}</div>}
  </ToolShell>;
}

export function WorkingDaysCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today), [to, setTo] = useState(today);
  const days = useMemo(() => { const start = new Date(from+'T00:00:00'), end = new Date(to+'T00:00:00'); if (Number.isNaN(+start)||Number.isNaN(+end)) return null; const forward = +start <= +end ? [start,end] : [end,start]; let total=0; const current=new Date(forward[0]); while(+current<=+forward[1]) { if(current.getDay()!==0&&current.getDay()!==6)total+=1; current.setDate(current.getDate()+1); } return total; },[from,to]);
  return <ToolShell outputValue={days === null ? undefined : `${days} working days`} onReset={() => { setFrom(today);setTo(today); }} shareSlug="working-days-calculator">
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Start date<input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className={field}/></label><label className="text-sm font-medium">End date<input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className={field}/></label></div>
    <div className="rounded-xl2 bg-black/[.02] p-7 text-center dark:bg-white/5"><div className="font-heading text-4xl font-bold">{days ?? '—'}</div><p className="mt-1 text-sm text-black/50 dark:text-white/50">Weekdays, inclusive (weekends excluded)</p></div>
  </ToolShell>;
}
