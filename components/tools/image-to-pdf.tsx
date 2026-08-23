'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download, UploadCloud, X } from 'lucide-react';

export function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const imgs = Array.from(fileList).filter((f) => /image\/(png|jpeg|jpg)/.test(f.type));
    setFiles((prev) => [...prev, ...imgs]);
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function build() {
    setProcessing(true);
    setError(null);
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const image = file.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const outBytes = await pdf.save();
      const blob = new Blob([outBytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'images.pdf';
      a.click();
    } catch {
      setError('Could not build the PDF. Make sure all files are valid PNG or JPEG images.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ToolShell shareSlug="image-to-pdf">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl2 border-2 border-dashed border-black/15 p-10 text-center dark:border-white/15">
        <UploadCloud className="h-8 w-8 text-black/30 dark:text-white/30" />
        <span className="text-sm font-medium">Click to choose PNG or JPEG images</span>
        <span className="text-xs text-black/40 dark:text-white/40">Each image becomes one PDF page, in the order added</span>
        <input type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
              <span className="flex-1 truncate text-sm">{i + 1}. {f.name}</span>
              <button onClick={() => removeFile(i)} className="text-danger"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button disabled={files.length === 0 || processing} onClick={build}>
        <Download className="h-4 w-4" /> {processing ? 'Building PDF...' : `Create PDF from ${files.length} image${files.length === 1 ? '' : 's'}`}
      </Button>
    </ToolShell>
  );
}
