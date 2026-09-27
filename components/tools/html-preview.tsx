'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

const SAMPLE = `<div style="font-family: sans-serif; padding: 24px; text-align: center;">\n  <h1 style="color: #6366F1;">Hello, NovaTools!</h1>\n  <p>Edit the HTML on the left to see a live preview.</p>\n</div>\n`;

export function HtmlPreview() {
  const [html, setHtml] = useState(SAMPLE);

  return (
    <ToolShell outputValue={html} downloadFilename="preview.html" onReset={() => setHtml('')} shareSlug="html-preview">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">HTML</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={14}
            spellCheck={false}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Live preview</label>
          <iframe
            title="HTML preview"
            srcDoc={html}
            sandbox="allow-scripts"
            className="h-[22rem] w-full rounded-xl border border-black/10 bg-white dark:border-white/10"
          />
        </div>
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">
        Preview runs in a sandboxed frame with no access to this page, so it&rsquo;s safe to paste any HTML.
      </p>
    </ToolShell>
  );
}
