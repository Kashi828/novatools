'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { ImageDropzone } from '@/components/image-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const SIZES = [16, 32, 48, 180, 192, 512];

export function FaviconGenerator() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<number, string>>({});

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    const img = new Image();
    img.onload = () => {
      const results: Record<number, string> = {};
      for (const size of SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, size, size);
        results[size] = canvas.toDataURL('image/png');
      }
      setOutputs(results);
    };
    img.src = url;
  }

  return (
    <ToolShell shareSlug="favicon-generator">
      {!srcUrl && <ImageDropzone onFile={handleFile} />}

      {srcUrl && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                {outputs[size] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={outputs[size]} alt={`${size}x${size}`} width={Math.min(size, 64)} height={Math.min(size, 64)} className="rounded border border-black/10 dark:border-white/10" />
                )}
                <span className="text-xs text-black/50 dark:text-white/50">{size}×{size}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = outputs[size];
                    a.download = `favicon-${size}x${size}.png`;
                    a.click();
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setSrcUrl(null)}>Choose a different image</Button>
        </div>
      )}
    </ToolShell>
  );
}
