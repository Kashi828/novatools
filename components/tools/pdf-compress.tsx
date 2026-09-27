'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolShell } from '@/components/tool-shell';
import { PdfDropzone } from '@/components/pdf-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    setFile(files[0]);
    setResult(null);
    setError(null);
  }

  async function compress() {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const outBytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes as BlobPart], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch {
      setError('Could not process this PDF — it may be encrypted or corrupted.');
    } finally {
      setProcessing(false);
    }
  }

  const reduction = file && result ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <ToolShell shareSlug="pdf-compress">
      {!file && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here, or click to browse" />}

      {file && (
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">{file.name}</span> — {formatBytes(file.size)}
          </p>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 text-xs text-warning">
            This compresses by cleaning up the PDF&rsquo;s internal structure — it doesn&rsquo;t re-encode embedded images,
            so scans and photo-heavy PDFs will shrink less than PDFs with mostly text and vector graphics.
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          {result && (
            <p className="text-sm text-success">
              New size: {formatBytes(result.size)} ({reduction > 0 ? `${reduction}% smaller` : 'no significant reduction'})
            </p>
          )}

          <div className="flex gap-2">
            <Button disabled={processing} onClick={compress}>
              {processing ? 'Compressing...' : 'Compress'}
            </Button>
            {result && (
              <Button
                variant="outline"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = result.url;
                  a.download = 'compressed.pdf';
                  a.click();
                }}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            )}
            <Button variant="ghost" onClick={() => { setFile(null); setResult(null); }}>
              Choose a different PDF
            </Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
