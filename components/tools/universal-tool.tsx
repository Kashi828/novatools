'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

export const EXTRA_TOOL_CONFIG: Record<string, { title: string; placeholder: string; description: string; mode?: 'text' | 'numbers' }> = {
  'remove-extra-spaces': { title: 'Remove Extra Spaces', placeholder: 'Paste text with extra spaces...', description: 'Normalize repeated spaces without changing the words.' },
  'remove-blank-lines': { title: 'Remove Blank Lines', placeholder: 'Paste text with empty lines...', description: 'Remove empty lines while preserving the remaining content.' },
  'sort-words': { title: 'Sort Words', placeholder: 'Enter words or text...', description: 'Sort words alphabetically and return one clean list.' },
  'reverse-words': { title: 'Reverse Words', placeholder: 'Enter a sentence...', description: 'Reverse word order while keeping each word intact.' },
  'count-sentences': { title: 'Sentence Counter', placeholder: 'Paste your text...', description: 'Count sentences in any text.' },
  'extract-emails': { title: 'Email Extractor', placeholder: 'Paste text containing email addresses...', description: 'Find and list email addresses from pasted text.' },
  'extract-urls': { title: 'URL Extractor', placeholder: 'Paste text containing links...', description: 'Find and list URLs from pasted text.' },
  'extract-hashtags': { title: 'Hashtag Extractor', placeholder: 'Paste social media text...', description: 'Extract hashtags from any text.' },
  'extract-mentions': { title: 'Mention Extractor', placeholder: 'Paste social media text...', description: 'Extract @mentions from any text.' },
  'tabs-to-spaces': { title: 'Tabs to Spaces', placeholder: 'Paste code or text containing tabs...', description: 'Replace tab characters with spaces.' },
  'text-wrapper': { title: 'Text Wrapper', placeholder: 'Paste text to wrap...', description: 'Wrap long lines to a chosen character width.' },
  'join-lines': { title: 'Join Lines', placeholder: 'Paste one item per line...', description: 'Join lines into one clean sentence or list.' },
  'json-escape': { title: 'JSON Escape', placeholder: 'Paste text to escape for JSON...', description: 'Escape quotes, slashes, and control characters for JSON strings.' },
  'json-unescape': { title: 'JSON Unescape', placeholder: 'Paste an escaped JSON string...', description: 'Decode escaped JSON string content.' },
  'html-escape': { title: 'HTML Escape', placeholder: 'Paste HTML or text...', description: 'Escape characters that have special meaning in HTML.' },
  'html-unescape': { title: 'HTML Unescape', placeholder: 'Paste HTML entities...', description: 'Decode common HTML entities back into readable text.' },
  'unicode-escape': { title: 'Unicode Escape', placeholder: 'Paste text...', description: 'Convert characters to Unicode escape sequences.' },
  'unicode-decoder': { title: 'Unicode Decoder', placeholder: 'Paste Unicode escape sequences...', description: 'Decode Unicode escape sequences.' },
  'url-query-builder': { title: 'URL Query Builder', placeholder: 'key=value\nname=NovaTools', description: 'Build an encoded query string from key=value lines.' },
  'query-string-parser': { title: 'Query String Parser', placeholder: '?name=Nova&tool=converter', description: 'Parse a URL query string into readable key/value pairs.' },
  'csv-cleaner': { title: 'CSV Cleaner', placeholder: 'Paste CSV data...', description: 'Trim CSV cells and normalize line endings.' },
  'sql-formatter-lite': { title: 'SQL Formatter', placeholder: 'SELECT * FROM users WHERE id=1;', description: 'Apply lightweight readable formatting to SQL.' },
  'json-to-typescript': { title: 'JSON to TypeScript', placeholder: '{"name":"Nova","count":1}', description: 'Generate a TypeScript interface from a JSON object.' },
  'hex-color-converter': { title: 'Hex Color Converter', placeholder: '#D4A84F', description: 'Convert a HEX color into RGB and HSL values.' },
  'average-calculator': { title: 'Average Calculator', placeholder: '10, 20, 30, 40', description: 'Calculate the arithmetic mean of a list of numbers.' },
  'median-calculator': { title: 'Median Calculator', placeholder: '10, 4, 8, 12, 3', description: 'Find the median of a list of numbers.' },
  'ratio-calculator': { title: 'Ratio Calculator', placeholder: '2:3', description: 'Simplify a ratio to its smallest whole-number form.' },
  'proportion-calculator': { title: 'Proportion Calculator', placeholder: 'a:b = c:x → 2:3 = 8:x', description: 'Solve a missing value in a proportion.', mode:'numbers' },
  'speed-calculator': { title: 'Speed Calculator', placeholder: 'Distance and time', description: 'Calculate speed from distance and time.', mode: 'numbers' },
  'time-calculator': { title: 'Time Calculator', placeholder: 'Minutes', description: 'Convert minutes into hours, minutes, and seconds.', mode: 'numbers' },
  'distance-calculator': { title: 'Distance Calculator', placeholder: 'Speed and time', description: 'Calculate distance from speed and time.', mode: 'numbers' },
  'unit-rate-calculator': { title: 'Unit Rate Calculator', placeholder: 'Total quantity and units', description: 'Find the cost or amount per single unit.', mode: 'numbers' },
  'profit-margin-calculator': { title: 'Profit Margin Calculator', placeholder: 'Cost and selling price', description: 'Calculate profit and profit margin.', mode: 'numbers' },
  'markup-calculator': { title: 'Markup Calculator', placeholder: 'Cost and selling price', description: 'Calculate markup amount and percentage.', mode: 'numbers' },
  'commission-calculator': { title: 'Commission Calculator', placeholder: 'Sale amount and commission %', description: 'Calculate sales commission.', mode: 'numbers' },
  'simple-interest-calculator': { title: 'Simple Interest Calculator', placeholder: 'Principal, rate %, years', description: 'Calculate simple interest and total amount.', mode: 'numbers' },
  'compound-interest-calculator': { title: 'Compound Interest Calculator', placeholder: 'Principal, rate %, years', description: 'Estimate compound growth with annual compounding.', mode: 'numbers' },
  'break-even-calculator': { title: 'Break-Even Calculator', placeholder: 'Fixed cost, price, variable cost', description: 'Find the number of units needed to break even.', mode: 'numbers' },
  'study-hours-calculator': { title: 'Study Hours Calculator', placeholder: 'Total hours and days', description: 'Calculate the recommended daily study time.', mode: 'numbers' },
  'grade-needed-calculator': { title: 'Grade Needed Calculator', placeholder: 'Current %, target %, remaining weight %', description: 'Estimate the score needed on remaining work.', mode: 'numbers' },
  'weighted-grade-calculator': { title: 'Weighted Grade Calculator', placeholder: 'Grade, weight pairs: 80,40; 90,60', description: 'Calculate a weighted course grade.' },
  'exam-score-calculator': { title: 'Exam Score Calculator', placeholder: 'Correct answers and total questions', description: 'Calculate an exam percentage.', mode: 'numbers' },
  'percentage-to-fraction': { title: 'Percentage to Fraction', placeholder: '37.5%', description: 'Convert a percentage to a simplified fraction.' },
  'utm-builder': { title: 'UTM Builder', placeholder: 'https://example.com/page\nsource=google\nmedium=cpc\ncampaign=launch', description: 'Build a campaign URL with UTM parameters.' },
  'robots-generator': { title: 'Robots.txt Generator', placeholder: 'example.com', description: 'Generate a simple robots.txt file for a website.' },
  'sitemap-url-builder': { title: 'Sitemap URL Builder', placeholder: 'https://example.com\nhttps://example.com/about', description: 'Turn a URL list into sitemap XML.' },
  'open-graph-text': { title: 'Open Graph Meta Generator', placeholder: 'Page title\nPage description', description: 'Generate Open Graph meta markup from page details.' },
  'html-link-generator': { title: 'HTML Link Generator', placeholder: 'NovaTools | https://example.com', description: 'Generate accessible HTML anchor tags.' },
  'hex-encoder': { title: 'Hex Encoder', placeholder: 'NovaTools', description: 'Encode text as hexadecimal bytes.' },
  'hex-decoder': { title: 'Hex Decoder', placeholder: '4e6f7661546f6f6c73', description: 'Decode hexadecimal bytes into text.' },
  'rot13-encoder': { title: 'ROT13 Encoder', placeholder: 'Paste text...', description: 'Encode or decode text using ROT13.' },
  'password-mask-generator': { title: 'Password Mask Generator', placeholder: 'My secret phrase', description: 'Create a visual masked representation for demos and mockups.' },
};

function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }
function nums(input: string) { return input.split(/[,\s;]+/).map(Number).filter(Number.isFinite); }
function transform(slug: string, input: string, a: number, b: number, c: number) {
  switch (slug) {
    case 'remove-extra-spaces': return input.replace(/[ \t]+/g, ' ').replace(/^ +| +$/gm, '');
    case 'remove-blank-lines': return input.split(/\r?\n/).filter((line) => line.trim()).join('\n');
    case 'sort-words': return input.trim().split(/\s+/).filter(Boolean).sort((x,y)=>x.localeCompare(y,undefined,{sensitivity:'base'})).join('\n');
    case 'reverse-words': return input.trim().split(/\s+/).reverse().join(' ');
    case 'count-sentences': return String((input.match(/[^.!?]+[.!?]+/g) || []).length || (input.trim() ? 1 : 0));
    case 'extract-emails': return [...new Set(input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])].join('\n');
    case 'extract-urls': return [...new Set(input.match(/https?:\/\/[^\s<]+/gi) || [])].join('\n');
    case 'extract-hashtags': return [...new Set(input.match(/#[\p{L}\p{N}_-]+/gu) || [])].join('\n');
    case 'extract-mentions': return [...new Set(input.match(/@[A-Z0-9._-]+/gi) || [])].join('\n');
    case 'tabs-to-spaces': return input.replace(/\t/g, '    ');
    case 'text-wrapper': return input.split(/\r?\n/).flatMap(line => line.match(/.{1,80}(?:\s+|$)/g)?.map(s=>s.trim()) || ['']).join('\n');
    case 'join-lines': return input.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).join(' ');
    case 'json-escape': return JSON.stringify(input).slice(1,-1);
    case 'json-unescape': try { return JSON.parse('"'+input+'"'); } catch { return 'Invalid escaped JSON string.'; }
    case 'html-escape': return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    case 'html-unescape': return input.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
    case 'unicode-escape': return [...input].map(ch => '\\u'+ch.codePointAt(0)!.toString(16).padStart(4,'0')).join('');
    case 'unicode-decoder': return input.replace(/\\u([0-9a-f]{4})/gi, (_,h)=>String.fromCharCode(parseInt(h,16)));
    case 'url-query-builder': return input.split(/\r?\n/).filter(Boolean).map(x=>x.split('=').map(encodeURIComponent).join('=')).join('&');
    case 'query-string-parser': { const raw=input.replace(/^.*?\?/,'').split('#')[0]; return new URLSearchParams(raw).toString().replace(/&/g,'\n& '); }
    case 'csv-cleaner': return input.split(/\r?\n/).map(row=>row.split(',').map(cell=>cell.trim()).join(',')).join('\n');
    case 'sql-formatter-lite': return input.replace(/\s+/g,' ').replace(/\b(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|VALUES|SET|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)\b/gi,'\n$1').replace(/\b(SELECT|UPDATE|INSERT INTO|DELETE FROM)\b/gi,'$1\n').trim();
    case 'json-to-typescript': try { const obj=JSON.parse(input); const entries=Object.entries(obj).map(([k,v])=>`  ${k}: ${Array.isArray(v)?'unknown[]':v===null?'unknown':typeof v};`); return `interface Root {\n${entries.join('\n')}\n}`; } catch { return 'Enter a JSON object.'; }
    case 'hex-color-converter': { const m=input.trim().replace('#',''); if(!/^[0-9a-f]{6}$/i.test(m)) return 'Use a 6-digit HEX color, e.g. #D4A84F.'; const r=parseInt(m.slice(0,2),16),g=parseInt(m.slice(2,4),16),bl=parseInt(m.slice(4),16); const max=Math.max(r,g,bl)/255,min=Math.min(r,g,bl)/255,l=(max+min)/2,d=max-min; let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));const rr=r/255,gg=g/255,bb=bl/255;if(max===rr)h=60*((gg-bb)/d%6);else if(max===gg)h=60*((bb-rr)/d+2);else h=60*((rr-gg)/d+4);if(h<0)h+=360;}return `RGB(${r}, ${g}, ${bl})\nHSL(${Math.round(h)}°, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`; }
    case 'average-calculator': { const n=nums(input); return n.length?String(n.reduce((x,y)=>x+y,0)/n.length):'Enter numbers.'; }
    case 'median-calculator': { const n=nums(input).sort((x,y)=>x-y); return n.length?String(n.length%2?n[(n.length-1)/2]:(n[n.length/2-1]+n[n.length/2])/2):'Enter numbers.'; }
    case 'ratio-calculator': { const [x,y]=input.split(':').map(Number); if(!Number.isFinite(x)||!Number.isFinite(y))return 'Use a:b format.'; const g=gcd(x,y); return `${x/g}:${y/g}`; }
    case 'proportion-calculator': return b ? String((a*c)/b) : 'Enter a, b, and c in the three fields.';
    case 'speed-calculator': return b ? `${a/b} distance units per time` : 'Enter distance and time.';
    case 'time-calculator': return Number.isFinite(a) ? `${Math.floor(a/60)} h ${a%60} min (${Math.round(a*60)} sec)` : 'Enter minutes.';
    case 'distance-calculator': return `${a*b} distance units`;
    case 'unit-rate-calculator': return b ? String(a/b) : 'Enter total and units.';
    case 'profit-margin-calculator': return `Profit: ${b-a}\nMargin: ${b ? (((b-a)/b)*100).toFixed(2)+'%' : '—'}`;
    case 'markup-calculator': return `Markup: ${b-a}\nMarkup rate: ${a ? (((b-a)/a)*100).toFixed(2)+'%' : '—'}`;
    case 'commission-calculator': return `${(a*b/100).toFixed(2)}`;
    case 'simple-interest-calculator': return `Interest: ${(a*b*c/100).toFixed(2)}\nTotal: ${(a+a*b*c/100).toFixed(2)}`;
    case 'compound-interest-calculator': { const total=a*Math.pow(1+b/100,c); return `Interest: ${(total-a).toFixed(2)}\nTotal: ${total.toFixed(2)}`; }
    case 'break-even-calculator': return b>c ? `${Math.ceil(a/(b-c))} units` : 'Selling price must exceed variable cost.';
    case 'study-hours-calculator': return b ? `${(a/b).toFixed(2)} hours/day` : 'Enter total hours and days.';
    case 'grade-needed-calculator': return c ? `${((b-a*(1-c/100))/(c/100)).toFixed(2)}% needed` : 'Enter current %, target %, remaining weight %.';
    case 'weighted-grade-calculator': { const pairs=input.split(';').map(p=>p.split(',').map(Number)).filter(p=>p.length===2&&p.every(Number.isFinite)); const weight=pairs.reduce((s,p)=>s+p[1],0); return weight?`${pairs.reduce((s,p)=>s+p[0]*p[1],0)/weight}`:'Use grade,weight pairs.'; }
    case 'exam-score-calculator': return b ? `${((a/b)*100).toFixed(2)}%` : 'Enter correct and total questions.';
    case 'percentage-to-fraction': { const p=parseFloat(input.replace('%','')); if(!Number.isFinite(p))return 'Enter a percentage.'; const den=100, num=Math.round(p*den); const g=gcd(num,den); return `${num/g}/${den/g}`; }
    case 'utm-builder': { const [url,...pairs]=input.split(/\n/); const q=pairs.filter(Boolean).map(x=>x.split('=').map(encodeURIComponent).join('=')); return `${url}${url.includes('?')?'&':'?'}${q.join('&')}`; }
    case 'robots-generator': { const host=input.trim().replace('https://','').replace('http://','').replace(/\/$/,''); return `User-agent: *\nAllow: /\nSitemap: https://${host}/sitemap.xml`; }
    case 'sitemap-url-builder': return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${input.split(/\r?\n/).filter(Boolean).map(u=>`  <url><loc>${u.trim()}</loc></url>`).join('\n')}\n</urlset>`;
    case 'open-graph-text': return `<meta property="og:title" content="${input.split(/\r?\n/)[0] || ''}">\n<meta property="og:description" content="${input.split(/\r?\n/)[1] || ''}">`;
    case 'html-link-generator': { const [label,url]=input.split('|').map(s=>s?.trim()); return `<a href="${url||''}">${label||''}</a>`; }
    case 'hex-encoder': return new TextEncoder().encode(input).reduce((s,n)=>s+n.toString(16).padStart(2,'0'),'');
    case 'hex-decoder': try { return new TextDecoder().decode(new Uint8Array((input.replace(/\s/g,'').match(/.{1,2}/g)||[]).map(h=>parseInt(h,16)))); } catch { return 'Invalid hexadecimal.'; }
    case 'rot13-encoder': return input.replace(/[A-Za-z]/g,c=>String.fromCharCode(c.charCodeAt(0)+(c.toLowerCase()<'n'?13:-13)));
    case 'password-mask-generator': return '•'.repeat(Math.min(input.length,64));
    default: return input;
  }
}

export function UniversalTool() {
  const pathname = usePathname(); const slug = pathname.split('/').filter(Boolean).pop() || 'remove-extra-spaces'; const config = EXTRA_TOOL_CONFIG[slug] || EXTRA_TOOL_CONFIG['remove-extra-spaces'];
  const [input,setInput]=useState(''); const [output,setOutput]=useState(''); const [a,setA]=useState(''); const [b,setB]=useState(''); const [c,setC]=useState(''); const [copied,setCopied]=useState(false);
  const run=()=>{ const values=[a,b,c].map(Number); setOutput(transform(slug,input,values[0],values[1],values[2])); setCopied(false); };
  const numberHint = useMemo(()=>config.mode==='numbers' ? 'Use the numeric fields below for this calculator.' : '',[config.mode]);
  return <ToolShell outputValue={output||undefined} onReset={()=>{setInput('');setOutput('');setA('');setB('');setC('');}} shareSlug={slug}>
    <div className="rounded-2xl border border-primary-500/15 bg-primary-500/5 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><Sparkles className="h-5 w-5"/></div><div><h2 className="font-semibold">{config.title}</h2><p className="text-xs text-secondary-400">{config.description}</p></div></div></div>
    {config.mode==='numbers' && <div className="grid gap-3 sm:grid-cols-3">{[a,b,c].map((v,i)=><input key={i} type="number" value={v} onChange={e=>[setA,setB,setC][i](e.target.value)} placeholder={['Value 1','Value 2','Value 3'][i]} className="rounded-xl border border-current/10 bg-[rgb(var(--surface-page)/.6)] px-4 py-3 text-sm outline-none focus:border-primary-500/40"/>)}</div>}
    {numberHint && <p className="text-xs text-secondary-400">{numberHint}</p>}
    <div className="grid gap-4 lg:grid-cols-2"><textarea value={input} onChange={e=>setInput(e.target.value)} rows={12} placeholder={config.placeholder} className="w-full rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.6)] p-4 text-sm leading-6 outline-none focus:border-primary-500/40"/><textarea value={output} readOnly rows={12} placeholder="Result will appear here..." className="w-full rounded-2xl border border-current/10 bg-[rgb(var(--surface-page)/.45)] p-4 text-sm leading-6 outline-none"/></div>
    <div className="flex flex-wrap gap-3"><Button onClick={run}>Run tool</Button>{output && <Button variant="outline" onClick={()=>{void navigator.clipboard?.writeText(output);setCopied(true);}}>{copied?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}{copied?'Copied':'Copy result'}</Button>}</div>
  </ToolShell>;
}
