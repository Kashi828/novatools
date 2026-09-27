'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ToolShell } from '@/components/tool-shell';

const SAMPLE = `# Hello, NovaTools\n\nWrite **Markdown** on the left, see it rendered on the right.\n\n- Fast\n- Free\n- No signup\n\n> Works entirely in your browser.\n`;

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = await marked.parse(markdown);
      if (!cancelled) setHtml(DOMPurify.sanitize(raw));
    })();
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  return (
    <ToolShell outputValue={html} downloadFilename="preview.html" onReset={() => setMarkdown('')} shareSlug="markdown-preview">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Markdown</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={14}
            spellCheck={false}
            className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Preview</label>
          <div
            className="prose prose-sm h-[22rem] max-w-none overflow-auto rounded-xl border border-black/10 bg-white p-4 dark:prose-invert dark:border-white/10 dark:bg-white/5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolShell>
  );
}
