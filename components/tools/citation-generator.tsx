'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';

export function CitationGenerator() {
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const [author, setAuthor] = useState('Smith, Jane');
  const [year, setYear] = useState('2024');
  const [title, setTitle] = useState('The Study of Everything');
  const [source, setSource] = useState('Journal of Examples');
  const [url, setUrl] = useState('');

  const citation = useMemo(() => {
    if (style === 'APA') {
      return `${author} (${year}). ${title}. ${source}.${url ? ` ${url}` : ''}`;
    }
    if (style === 'MLA') {
      return `${author}. "${title}." ${source}, ${year}${url ? `, ${url}` : ''}.`;
    }
    return `${author}. "${title}." ${source} (${year})${url ? `. ${url}` : ''}.`;
  }, [style, author, year, title, source, url]);

  return (
    <ToolShell outputValue={citation} shareSlug="citation-generator">
      <div className="flex gap-2">
        {(['APA', 'MLA', 'Chicago'] as const).map((s) => (
          <Button key={s} size="sm" variant={style === s ? 'primary' : 'outline'} onClick={() => setStyle(s)}>
            {s}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Author (Last, First)</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Year</label>
          <input value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Source / Publisher</label>
          <input value={source} onChange={(e) => setSource(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">URL (optional)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      <pre className="whitespace-pre-wrap rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/5">{citation}</pre>
      <p className="text-xs text-black/40 dark:text-white/40">A simplified formatter covering common cases — always double-check against your institution&rsquo;s official style guide.</p>
    </ToolShell>
  );
}
