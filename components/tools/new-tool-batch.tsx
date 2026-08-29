'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const fieldClass = 'w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5';

function splitLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function TextSorter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('alpha');
  const output = useMemo(() => {
    const lines = splitLines(text);
    if (mode === 'length') return lines.sort((a, b) => a.length - b.length).join('\n');
    if (mode === 'reverse') return lines.sort((a, b) => b.localeCompare(a)).join('\n');
    if (mode === 'random') return [...lines].sort(() => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 - .5).join('\n');
    return lines.sort((a, b) => a.localeCompare(b)).join('\n');
  }, [text, mode]);

  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="text-sorter">
    <div className="grid gap-3 sm:grid-cols-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="One item per line..." className={fieldClass} />
      <textarea value={output} readOnly rows={10} placeholder="Sorted result appears here..." className={fieldClass} />
    </div>
    <label className="block text-sm font-medium">Sort order
      <select value={mode} onChange={(e) => setMode(e.target.value)} className={fieldClass}>
        <option value="alpha">A to Z</option><option value="reverse">Z to A</option><option value="length">Shortest to longest</option><option value="random">Randomize</option>
      </select>
    </label>
  </ToolShell>;
}

export function LineNumberer() {
  const [text, setText] = useState('');
  const [start, setStart] = useState('1');
  const output = useMemo(() => {
    const initial = Number(start) || 1;
    return text ? text.split(/\r?\n/).map((line, index) => `${initial + index}. ${line}`).join('\n') : '';
  }, [text, start]);

  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="line-numberer">
    <label className="block max-w-xs text-sm font-medium">Start at<input type="number" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} /></label>
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste lines to number..." className={fieldClass} /><textarea value={output} readOnly rows={10} className={fieldClass} /></div>
  </ToolShell>;
}

export function TextRepeater() {
  const [text, setText] = useState('');
  const [times, setTimes] = useState('3');
  const [separator, setSeparator] = useState('newline');
  const output = useMemo(() => {
    const count = Math.min(1000, Math.max(0, Number(times) || 0));
    return Array.from({ length: count }, () => text).join(separator === 'newline' ? '\n' : separator === 'space' ? ' ' : '');
  }, [text, times, separator]);

  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="text-repeater">
    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Text to repeat..." className={fieldClass} />
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Times<input type="number" min="0" max="1000" value={times} onChange={(e) => setTimes(e.target.value)} className={fieldClass} /></label><label className="text-sm font-medium">Separate with<select value={separator} onChange={(e) => setSeparator(e.target.value)} className={fieldClass}><option value="newline">New line</option><option value="space">Space</option><option value="none">Nothing</option></select></label></div>
    <textarea value={output} readOnly rows={8} className={fieldClass} />
  </ToolShell>;
}

export function RandomPicker() {
  const [items, setItems] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  function pick() {
    const values = splitLines(items);
    if (!values.length) return;
    const choice = values[crypto.getRandomValues(new Uint32Array(1))[0] % values.length];
    setPicked(choice);
    setHistory((previous) => [choice, ...previous].slice(0, 10));
  }
  return <ToolShell outputValue={picked ?? undefined} onReset={() => { setItems(''); setPicked(null); setHistory([]); }} shareSlug="random-picker">
    <textarea value={items} onChange={(e) => setItems(e.target.value)} rows={7} placeholder="Add choices, one per line..." className={fieldClass} />
    <Button onClick={pick}><RefreshCw className="h-4 w-4" /> Pick one</Button>
    {picked && <div className="rounded-xl2 bg-gradient-brand p-6 text-center font-heading text-2xl font-bold text-white shadow-glow">{picked}</div>}
    {history.length > 0 && <p className="text-sm text-black/50 dark:text-white/50">Recent picks: {history.join(' · ')}</p>}
  </ToolShell>;
}

export function DateDifferenceCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const result = useMemo(() => {
    const start = new Date(`${from}T00:00:00`).getTime();
    const end = new Date(`${to}T00:00:00`).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return null;
    const days = Math.abs(Math.round((end - start) / 86400000));
    return { days, weeks: Math.floor(days / 7), remainingDays: days % 7 };
  }, [from, to]);

  return <ToolShell outputValue={result ? `${result.days} days` : undefined} onReset={() => { setFrom(today); setTo(today); }} shareSlug="date-difference-calculator">
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Start date<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={fieldClass} /></label><label className="text-sm font-medium">End date<input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={fieldClass} /></label></div>
    {result && <div className="grid grid-cols-3 gap-3">{[{label:'Days',value:result.days},{label:'Full weeks',value:result.weeks},{label:'Extra days',value:result.remainingDays}].map((item) => <div key={item.label} className="rounded-xl border border-black/10 bg-black/[.02] p-4 text-center dark:border-white/10 dark:bg-white/5"><div className="font-heading text-2xl font-bold">{item.value}</div><div className="text-xs text-black/50 dark:text-white/50">{item.label}</div></div>)}</div>}
  </ToolShell>;
}

export function UrlParser() {
  const [input, setInput] = useState('');
  const parsed = useMemo(() => {
    try { return input ? new URL(input.includes('://') ? input : `https://${input}`) : null; } catch { return null; }
  }, [input]);
  const output = parsed ? JSON.stringify({ protocol: parsed.protocol, hostname: parsed.hostname, port: parsed.port || '(default)', pathname: parsed.pathname, query: parsed.search || '(none)', hash: parsed.hash || '(none)', origin: parsed.origin }, null, 2) : '';
  return <ToolShell outputValue={output || undefined} onReset={() => setInput('')} shareSlug="url-parser">
    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://example.com/path?query=value#section" className={fieldClass} />
    {input && !parsed ? <p className="text-sm text-danger">Enter a valid URL.</p> : <pre className="min-h-48 overflow-auto rounded-xl border border-black/10 bg-black/[.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">{output || 'URL details will appear here.'}</pre>}
  </ToolShell>;
}

export function HtmlEntityTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const output = useMemo(() => {
    if (!text) return '';
    if (mode === 'encode') return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const node = document.createElement('textarea'); node.innerHTML = text; return node.value;
  }, [text, mode]);
  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="html-entity-encoder-decoder">
    <div className="flex gap-2"><Button size="sm" variant={mode === 'encode' ? 'primary' : 'outline'} onClick={() => setMode('encode')}>Encode</Button><Button size="sm" variant={mode === 'decode' ? 'primary' : 'outline'} onClick={() => setMode('decode')}>Decode</Button></div>
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste text or HTML entities..." className={fieldClass} /><textarea value={output} readOnly rows={10} className={fieldClass} /></div>
  </ToolShell>;
}

export function BinaryTextConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'toBinary' | 'toText'>('toBinary');
  const output = useMemo(() => {
    try {
      if (mode === 'toBinary') return Array.from(new TextEncoder().encode(text)).map((byte) => byte.toString(2).padStart(8, '0')).join(' ');
      const bytes = text.trim().split(/\s+/).filter(Boolean).map((part) => parseInt(part, 2));
      if (bytes.some((byte) => Number.isNaN(byte) || byte < 0 || byte > 255)) return 'Invalid binary. Use 8-bit values separated by spaces.';
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch { return 'Could not convert this value.'; }
  }, [text, mode]);
  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="binary-text-converter">
    <div className="flex gap-2"><Button size="sm" variant={mode === 'toBinary' ? 'primary' : 'outline'} onClick={() => setMode('toBinary')}>Text → Binary</Button><Button size="sm" variant={mode === 'toText' ? 'primary' : 'outline'} onClick={() => setMode('toText')}>Binary → Text</Button></div>
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder={mode === 'toBinary' ? 'Type text...' : '01001000 01101001'} className={fieldClass} /><textarea value={output} readOnly rows={10} className={fieldClass} /></div>
  </ToolShell>;
}

export function XmlFormatter() {
  const [text, setText] = useState('');
  const [minify, setMinify] = useState(false);
  const output = useMemo(() => {
    if (!text.trim()) return '';
    const parsed = new DOMParser().parseFromString(text, 'application/xml');
    if (parsed.querySelector('parsererror')) return 'Invalid XML. Check opening and closing tags.';
    const serialised = new XMLSerializer().serializeToString(parsed);
    if (minify) return serialised.replace(/>\s+</g, '><');
    let indent = 0;
    return serialised.replace(/>(<)/g, '>$1').replace(/(<[^/][^>]*>|<\/[^>]+>)/g, (tag) => {
      if (tag.startsWith('</')) indent = Math.max(0, indent - 1);
      const line = `${'  '.repeat(indent)}${tag}`;
      if (!tag.startsWith('</') && !tag.startsWith('<?') && !tag.endsWith('/>')) indent += 1;
      return `\n${line}`;
    }).trim();
  }, [text, minify]);
  return <ToolShell outputValue={output} onReset={() => setText('')} shareSlug="xml-formatter">
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={minify} onChange={(e) => setMinify(e.target.checked)} className="accent-primary-500" /> Minify output</label>
    <div className="grid gap-3 sm:grid-cols-2"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} placeholder="<root><item>Hello</item></root>" className={fieldClass} /><textarea value={output} readOnly rows={12} className={fieldClass} /></div>
  </ToolShell>;
}
