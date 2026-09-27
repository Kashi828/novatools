'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { ImageDropzone } from '@/components/image-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageCompressor() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  function handleFile(file: File) {
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    compress(url, quality);
  }

  function compress(url: string, q: number) {
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setOutputUrl(URL.createObjectURL(blob));
            setOutputSize(blob.size);
          }
          setProcessing(false);
        },
        'image/jpeg',
        q
      );
    };
    img.src = url;
  }

  function handleQualityChange(q: number) {
    setQuality(q);
    if (srcUrl) compress(srcUrl, q);
  }

  const reduction = originalSize && outputSize ? Math.round((1 - outputSize / originalSize) * 100) : 0;

  return (
    <ToolShell shareSlug="image-compressor">
      {!srcUrl && <ImageDropzone onFile={handleFile} />}

      {srcUrl && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-black/50 dark:text-white/50">Original ({formatBytes(originalSize)})</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Original" className="max-h-56 w-full rounded-xl border border-black/10 object-contain dark:border-white/10" />
            </div>
            <div>
              <p className="mb-1 text-xs text-black/50 dark:text-white/50">
                Compressed {outputSize ? `(${formatBytes(outputSize)}, ${reduction}% smaller)` : ''}
              </p>
              {outputUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={outputUrl} alt="Compressed" className="max-h-56 w-full rounded-xl border border-black/10 object-contain dark:border-white/10" />
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm"><span>Quality</span><span>{Math.round(quality * 100)}%</span></div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => handleQualityChange(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              disabled={!outputUrl || processing}
              onClick={() => {
                if (!outputUrl) return;
                const a = document.createElement('a');
                a.href = outputUrl;
                a.download = 'compressed.jpg';
                a.click();
              }}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" onClick={() => setSrcUrl(null)}>
              Choose a different image
            </Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
