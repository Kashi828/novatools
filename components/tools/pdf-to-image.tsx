'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { PdfDropzone } from '@/components/pdf-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
}

export function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    setFile(files[0]);
    setPages([]);
    setError(null);
    await render(files[0]);
  }

  async function render(pdfFile: File) {
    setRendering(true);
    setError(null);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const bytes = await pdfFile.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport }).promise;
        rendered.push({ pageNumber: i, dataUrl: canvas.toDataURL('image/png') });
      }
      setPages(rendered);
    } catch {
      setError('Could not render this PDF. It may be encrypted, corrupted, or password-protected.');
    } finally {
      setRendering(false);
    }
  }

  return (
    <ToolShell shareSlug="pdf-to-image">
      {!file && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here, or click to browse" />}

      {file && (
        <div className="space-y-4">
          <p className="text-sm font-medium">{file.name}</p>

          {rendering && <p className="text-sm text-black/50 dark:text-white/50">Rendering pages...</p>}
          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pages.map((p) => (
              <div key={p.pageNumber} className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.dataUrl} alt={`Page ${p.pageNumber}`} className="w-full rounded-lg border border-black/10 dark:border-white/10" />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = p.dataUrl;
                    a.download = `page-${p.pageNumber}.png`;
                    a.click();
                  }}
                >
                  <Download className="h-3.5 w-3.5" /> Page {p.pageNumber}
                </Button>
              </div>
            ))}
          </div>

          <Button variant="ghost" onClick={() => { setFile(null); setPages([]); }}>
            Choose a different PDF
          </Button>
        </div>
      )}
    </ToolShell>
  );
}
