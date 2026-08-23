'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolShell } from '@/components/tool-shell';
import { PdfDropzone } from '@/components/pdf-dropzone';
import { Button } from '@/components/ui/button';
import { PremiumGate } from '@/components/premium-gate';
import { Download, GripVertical, X, Lock } from 'lucide-react';

const FREE_FILE_LIMIT = 3;

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(newFiles: File[]) {
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  }

  async function merge() {
    setMerging(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const outBytes = await merged.save();
      const blob = new Blob([outBytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'merged.pdf';
      a.click();
    } catch {
      setError('Could not merge these PDFs — make sure each file is a valid, unencrypted PDF.');
    } finally {
      setMerging(false);
    }
  }

  return (
    <ToolShell shareSlug="pdf-merge">
      <PdfDropzone multiple onFiles={addFiles} />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
              <GripVertical className="h-4 w-4 shrink-0 text-black/30 dark:text-white/30" />
              <span className="flex-1 truncate text-sm">{f.name}</span>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-xs text-black/50 disabled:opacity-30 dark:text-white/50">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === files.length - 1} className="text-xs text-black/50 disabled:opacity-30 dark:text-white/50">↓</button>
              <button onClick={() => removeFile(i)} className="text-danger"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {files.length > FREE_FILE_LIMIT ? (
        <PremiumGate
          fallback={
            <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
              <Lock className="h-4 w-4 shrink-0" />
              <div>
                Free plan merges up to {FREE_FILE_LIMIT} PDFs at a time. Remove {files.length - FREE_FILE_LIMIT} file
                {files.length - FREE_FILE_LIMIT === 1 ? '' : 's'}, or{' '}
                <a href="/pricing" className="font-medium underline">
                  upgrade to Premium
                </a>{' '}
                for unlimited merges.
              </div>
            </div>
          }
        >
          <Button disabled={merging} onClick={merge}>
            <Download className="h-4 w-4" /> {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
          </Button>
        </PremiumGate>
      ) : (
        <Button disabled={files.length < 2 || merging} onClick={merge}>
          <Download className="h-4 w-4" /> {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
        </Button>
      )}
    </ToolShell>
  );
}
