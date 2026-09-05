'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

type Config = { title: string; description: string; placeholder: string; mode?: 'text' | 'rgb' | 'fraction' };
const CONFIG: Record<string, Config> = {
  'trim-lines': { title: 'Trim Lines', description: 'Remove whitespace around every line.', placeholder: 'Paste multiline text...' },
  'remove-punctuation': { title: 'Remove Punctuation', description: 'Strip punctuation characters from text.', placeholder: 'Paste text...' },
  'dedupe-words': { title: 'Deduplicate Words', description: 'Remove repeated words while keeping first occurrence.', placeholder: 'Paste repeated words...' },
  'word-length-counter': { title: 'Word Length Counter', description: 'Show total words and average word length.', placeholder: 'Paste text...' },
  'comma-to-lines': { title: 'Comma to Lines', description: 'Convert comma-separated values into one per line.', placeholder: 'one, two, three' },
  'lines-to-comma': { title: 'Lines to Commas', description: 'Join lines into a comma-separated list.', placeholder: 'one\ntwo\nthree' },
  'csv-to-tsv': { title: 'CSV to TSV', description: 'Convert comma-separated data into tab-separated data.', placeholder: 'name,score\nNova,100' },
  'csv-to-markdown': { title: 'CSV to Markdown', description: 'Turn CSV rows into a Markdown table.', placeholder: 'name,score\nNova,100' },
  'json-key-sorter': { title: 'JSON Key Sorter', description: 'Sort JSON object keys recursively.', placeholder: '{"b":2,"a":1}' },
  'base64-url-encoder': { title: 'Base64 URL Encoder', description: 'Encode text using URL-safe Base64.', placeholder: 'NovaTools' },
  'base64-url-decoder': { title: 'Base64 URL Decoder', description: 'Decode URL-safe Base64 into text.', placeholder: 'Tm92YVRvb2xz' },
  'ipv4-validator': { title: 'IPv4 Validator', description: 'Check whether a value is a valid IPv4 address.', placeholder: '192.168.1.1' },
  'email-validator': { title: 'Email Validator', description: 'Check basic email address syntax.', placeholder: 'hello@example.com' },
  'url-domain-extractor': { title: 'URL Domain Extractor', description: 'Extract the hostname from a URL.', placeholder: 'https://www.example.com/path' },
  'hex-to-rgb': { title: 'HEX to RGB', description: 'Convert a six-digit HEX color to RGB.', placeholder: '#D4A84F' },
  'rgb-to-hex': { title: 'RGB to HEX', description: 'Convert RGB channels to a HEX color.', placeholder: '', mode: 'rgb' },
  'fraction-to-percent': { title: 'Fraction to Percent', description: 'Convert a fraction to a percentage.', placeholder: '3/8', mode: 'fraction' },
  'lcm-gcd-calculator': { title: 'GCD & LCM Calculator', description: 'Find the greatest common divisor and least common multiple.', placeholder: '48, 18' },
  'decimal-to-percent': { title: 'Decimal to Percent', description: 'Convert a decimal into percentage form.', placeholder: '0.375' },
};
function gcd(a:number,b:number){a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b)[a,b]=[b,a%b];return a||1;}
function nums(v:string){return v.split(/[,;\s]+/).map(Number).filter(Number.isFinite);}
function encode64(v:string){const bytes=new TextEncoder().encode(v);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function decode64(v:string){const p=v.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-v.length%4)%4);const bin=atob(p);return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)));}
function runTool(slug:string,input:string){
  switch(slug){
    case 'trim-lines': return input.split(/\r?\n/).map(s=>s.trim()).join('\n');
    case 'remove-punctuation': return input.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g,'');
    case 'dedupe-words': {const seen=new Set<string>();return input.split(/\s+/).filter(w=>w&&(!seen.has(w.toLowerCase())&&(seen.add(w.toLowerCase()),true))).join(' ');}
    case 'word-length-counter': {const ws=input.trim().split(/\s+/).filter(Boolean).map(w=>w.replace(/[^\p{L}\p{N}]/gu,''));return ws.length?`Words: ${ws.length}\nAverage word length: ${(ws.reduce((s,w)=>s+w.length,0)/ws.length).toFixed(2)}`:'No words found.';}
    case 'comma-to-lines': return input.split(',').map(s=>s.trim()).filter(Boolean).join('\n');
    case 'lines-to-comma': return input.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).join(', ');
    case 'csv-to-tsv': return input.split(/\r?\n/).map(r=>r.split(',').map(c=>c.trim()).join('\t')).join('\n');
    case 'csv-to-markdown': {const rows=input.split(/\r?\n/).filter(Boolean).map(r=>r.split(',').map(c=>c.trim()));if(!rows.length)return '';return `| ${rows[0].join(' | ')} |\n| ${rows[0].map(()=> '---').join(' | ')} |\n${rows.slice(1).map(r=>`| ${r.join(' | ')} |`).join('\n')}`;}
    case 'json-key-sorter': {try{const v=JSON.parse(input);const sort=(x:any):any=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b)).map(([k,val])=>[k,sort(val)])):x;return JSON.stringify(sort(v),null,2);}catch{return 'Invalid JSON.';}}
    case 'base64-url-encoder': try{return encode64(input);}catch{return 'Could not encode input.';}
    case 'base64-url-decoder': try{return decode64(input.trim());}catch{return 'Invalid Base64 URL value.';}
    case 'ipv4-validator': {const p=input.trim().split('.').map(Number);return p.length===4&&p.every(n=>Number.isInteger(n)&&n>=0&&n<=255)?'Valid IPv4 address':'Invalid IPv4 address';}
    case 'email-validator': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())?'Valid email address':'Invalid email address';
    case 'url-domain-extractor': try{return new URL(input.includes('://')?input:`https://${input}`).hostname;}catch{return 'Invalid URL.';}
    case 'hex-to-rgb': {const h=input.trim().replace(/^#/,'');if(!/^[0-9a-f]{6}$/i.test(h))return 'Use a 6-digit HEX value.';return `RGB(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4),16)})`;}
    case 'fraction-to-percent': {const [n,d]=input.split('/').map(Number);return Number.isFinite(n)&&Number.isFinite(d)&&d!==0?`${((n/d)*100).toFixed(2)}%`:'Use numerator/denominator.';}
    case 'decimal-to-percent': {const n=Number(input);return Number.isFinite(n)?`${(n*100).toFixed(2)}%`:'Enter a decimal.';}
    case 'lcm-gcd-calculator': {const [a,b]=nums(input);if(!Number.isFinite(a)||!Number.isFinite(b))return 'Enter two integers.';const g=gcd(a,b);return `GCD: ${g}\nLCM: ${Math.abs(a*b)/g}`;}
    default:return input;
  }
}

export function UniversalToolPlus(){
  const pathname=usePathname();const slug=pathname.split('/').filter(Boolean).pop()||'trim-lines';const config=CONFIG[slug]||CONFIG['trim-lines'];
  const [input,setInput]=useState('');const [r,setR]=useState('');const [g,setG]=useState('');const [b,setB]=useState('');const [out,setOut]=useState('');const [copied,setCopied]=useState(false);
  const output=useMemo(()=>config.mode==='rgb'?out:runTool(slug,input),[config.mode,input,slug,out]);
  const execute=()=>{let value:string;if(config.mode==='rgb'){const parts=[Number(r),Number(g),Number(b)];value=parts.every(Number.isFinite)&&parts.every(n=>n>=0&&n<=255)?'#'+parts.map(n=>Math.round(n).toString(16).padStart(2,'0')).join('').toUpperCase():'Enter R, G and B values from 0 to 255.';}else{value=runTool(slug,input);}setOut(value);setCopied(false);};
  return <ToolShell outputValue={output||undefined} onReset={()=>{setInput('');setOut('');setR('');setG('');setB('');}} shareSlug={slug}>
    <div className="rounded-2xl border border-primary-500/15 bg-primary-500/5 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><Sparkles className="h-5 w-5"/></div><div><h2 className="font-semibold">{config.title}</h2><p className="text-xs text-secondary-400">{config.description}</p></div></div></div>
    {config.mode==='rgb'?<div className="grid gap-3 sm:grid-cols-3">{[r,g,b].map((v,i)=><input key={i} type="number" min="0" max="255" value={v} onChange={e=>[setR,setG,setB][i](e.target.value)} placeholder={['Red','Green','Blue'][i]} className="rounded-xl border border-current/10 bg-[rgb(var(--surface-page)/.6)] px-4 py-3 text-sm outline-none focus:border-primary-500/40"/>)}</div>:<textarea value={input} onChange={e=>setInput(e.target.value)} rows={12} placeholder={config.placeholder} className="w-full rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.6)] p-4 text-sm leading-6 outline-none focus:border-primary-500/40"/>}
    <textarea value={output} readOnly rows={12} placeholder="Result will appear here..." className="w-full rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.45)] p-4 text-sm leading-6 outline-none"/>
    <div className="flex gap-3"><Button onClick={execute}>Run tool</Button>{output&&<Button variant="outline" onClick={()=>{void navigator.clipboard?.writeText(output);setCopied(true);}}>{copied?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}{copied?'Copied':'Copy result'}</Button>}</div>
  </ToolShell>;
}
