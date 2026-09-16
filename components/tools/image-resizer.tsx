'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { ImageDropzone } from '@/components/image-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ImageResizer() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrigSize({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
      setSrcUrl(url);
    };
    img.src = url;
  }

  function updateWidth(w: number) {
    setWidth(w);
    if (lockAspect && origSize.w) setHeight(Math.round((w / origSize.w) * origSize.h));
  }

  function updateHeight(h: number) {
    setHeight(h);
    if (lockAspect && origSize.h) setWidth(Math.round((h / origSize.h) * origSize.w));
  }

  function resize() {
    if (!srcUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) setOutputUrl(URL.createObjectURL(blob));
      }, 'image/png');
    };
    img.src = srcUrl;
  }

  return (
    <ToolShell shareSlug="image-resizer">
      {!srcUrl && <ImageDropzone onFile={handleFile} />}

      {srcUrl && (
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outputUrl ?? srcUrl} alt="Preview" className="max-h-64 w-full rounded-xl border border-black/10 object-contain dark:border-white/10" />
          <p className="text-xs text-black/40 dark:text-white/40">Original: {origSize.w} × {origSize.h}px</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Width (px)</label>
              <input type="number" value={width} onChange={(e) => updateWidth(Number(e.target.value))} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Height (px)</label>
              <input type="number" value={height} onChange={(e) => updateHeight(Number(e.target.value))} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} className="accent-primary-500" />
            Lock aspect ratio
          </label>

          <div className="flex gap-2">
            <Button onClick={resize}>Resize</Button>
            <Button
              variant="outline"
              disabled={!outputUrl}
              onClick={() => {
                if (!outputUrl) return;
                const a = document.createElement('a');
                a.href = outputUrl;
                a.download = `resized-${width}x${height}.png`;
                a.click();
              }}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="ghost" onClick={() => setSrcUrl(null)}>
              Choose a different image
            </Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
