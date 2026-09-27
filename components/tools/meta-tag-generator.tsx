'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

export function MetaTagGenerator() {
  const [title, setTitle] = useState('NovaTools — Free Online Tools That Save You Time');
  const [description, setDescription] = useState('Hundreds of free online tools. No installation, no signup — just open and use.');
  const [url, setUrl] = useState('https://novatools.example.com');
  const [image, setImage] = useState('https://novatools.example.com/og-image.png');
  const [siteName, setSiteName] = useState('NovaTools');
  const [twitterHandle, setTwitterHandle] = useState('');

  const html = useMemo(() => {
    const lines = [
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      '',
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      `<meta property="og:url" content="${url}" />`,
      image && `<meta property="og:image" content="${image}" />`,
      siteName && `<meta property="og:site_name" content="${siteName}" />`,
      '',
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      image && `<meta name="twitter:image" content="${image}" />`,
      twitterHandle && `<meta name="twitter:site" content="@${twitterHandle.replace(/^@/, '')}" />`,
    ].filter(Boolean);
    return lines.join('\n');
  }, [title, description, url, image, siteName, twitterHandle]);

  return (
    <ToolShell outputValue={html} downloadFilename="meta-tags.html" shareSlug="meta-tag-generator">
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Page title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Page URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Image URL</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Site name</label>
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Twitter handle (optional)</label>
            <input value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="yourhandle" className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
          </div>
        </div>
      </div>

      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-black/10 bg-black/[0.02] p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        {html}
      </pre>
    </ToolShell>
  );
}
