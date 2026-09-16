'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolShell } from '@/components/tool-shell';
import { PdfDropzone } from '@/components/pdf-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function parseRange(input: string, maxPage: number): number[] {
  const pages = new Set<number>();
  for (const part of input.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let p = start; p <= end; p++) if (p >= 1 && p <= maxPage) pages.add(p);
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPage) pages.add(p);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState('1');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    const f = files[0];
    setError(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
      setFile(f);
      setRange(`1-${doc.getPageCount()}`);
    } catch {
      setError('Could not read this PDF — it may be encrypted or corrupted.');
    }
  }

  async function extract() {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const pageNumbers = parseRange(range, pageCount);
      if (!pageNumbers.length) throw new Error('No valid pages in range');

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pageNumbers.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const outBytes = await out.save();

      const blob = new Blob([outBytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `pages-${range.replace(/,/g, '_')}.pdf`;
      a.click();
    } catch {
      setError('Could not extract those pages. Check your page range and try again.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolShell shareSlug="pdf-split">
      {!file && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here, or click to browse" />}

      {file && (
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">{file.name}</span> — {pageCount} page{pageCount === 1 ? '' : 's'}
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium">Pages to extract</label>
            <input
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
            />
            <p className="mt-1 text-xs text-black/40 dark:text-white/40">Use ranges (1-3) and commas (1-3, 5, 8) — 1-indexed.</p>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex gap-2">
            <Button disabled={processing} onClick={extract}>
              <Download className="h-4 w-4" /> {processing ? 'Extracting...' : 'Extract & Download'}
            </Button>
            <Button variant="outline" onClick={() => setFile(null)}>Choose a different PDF</Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
