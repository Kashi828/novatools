'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BatchFile {
  file: File;
  outputUrl?: string;
  outputBlob?: Blob;
}

async function compressImage(file: File, quality: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) throw new Error('Compression failed');
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function BatchImageProcessorInner() {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [processing, setProcessing] = useState(false);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const imgs = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ file }));
    setFiles((prev) => [...prev, ...imgs]);
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function processAll() {
    setProcessing(true);
    const results: BatchFile[] = [];
    for (const item of files) {
      try {
        const blob = await compressImage(item.file, quality);
        results.push({ ...item, outputBlob: blob, outputUrl: URL.createObjectURL(blob) });
      } catch {
        results.push(item);
      }
    }
    setFiles(results);
    setProcessing(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    files.forEach((item, i) => {
      if (item.outputBlob) {
        const name = item.file.name.replace(/\.[^.]+$/, '') || `image-${i + 1}`;
        zip.file(`${name}-compressed.jpg`, item.outputBlob);
      }
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipBlob);
    a.download = 'compressed-images.zip';
    a.click();
  }

  const processedCount = files.filter((f) => f.outputBlob).length;

  return (
    <ToolShell shareSlug="batch-image-processor">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl2 border-2 border-dashed border-black/15 p-10 text-center dark:border-white/15">
        <span className="text-sm font-medium">Click to choose multiple images</span>
        <span className="text-xs text-black/40 dark:text-white/40">Compress dozens of images at once, download as a zip</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>

      {files.length > 0 && (
        <>
          <div>
            <div className="mb-1 flex justify-between text-sm"><span>Quality</span><span>{Math.round(quality * 100)}%</span></div>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary-500" />
          </div>

          <div className="max-h-72 space-y-2 overflow-auto">
            {files.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
                <span className="flex-1 truncate text-sm">{item.file.name}</span>
                <span className="text-xs text-black/40 dark:text-white/40">{(item.file.size / 1024).toFixed(0)} KB</span>
                {item.outputBlob && <span className="text-xs text-success">→ {(item.outputBlob.size / 1024).toFixed(0)} KB</span>}
                <button onClick={() => removeFile(i)} className="text-danger"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button disabled={processing} onClick={processAll}>
              {processing ? 'Processing...' : `Compress ${files.length} images`}
            </Button>
            {processedCount > 0 && (
              <Button variant="outline" onClick={downloadZip}>
                <Download className="h-4 w-4" /> Download all as .zip
              </Button>
            )}
          </div>
        </>
      )}
    </ToolShell>
  );
}

export function BatchImageProcessor() {
  return <BatchImageProcessorInner />;
}
