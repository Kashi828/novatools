'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { ImageDropzone } from '@/components/image-dropzone';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const FORMATS = [
  { label: 'PNG', mime: 'image/png', ext: 'png' },
  { label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', mime: 'image/webp', ext: 'webp' },
] as const;

export function ImageConverter() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<(typeof FORMATS)[number]>(FORMATS[2]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    convert(url, format.mime);
  }

  function convert(url: string, mime: string) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (mime === 'image/jpeg') {
        ctx!.fillStyle = '#FFFFFF';
        ctx?.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) setOutputUrl(URL.createObjectURL(blob));
      }, mime, 0.92);
    };
    img.src = url;
  }

  function changeFormat(f: (typeof FORMATS)[number]) {
    setFormat(f);
    if (srcUrl) convert(srcUrl, f.mime);
  }

  return (
    <ToolShell shareSlug="image-converter">
      {!srcUrl && <ImageDropzone onFile={handleFile} />}

      {srcUrl && (
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outputUrl ?? srcUrl} alt="Preview" className="max-h-64 w-full rounded-xl border border-black/10 object-contain dark:border-white/10" />

          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <Button key={f.mime} size="sm" variant={format.mime === f.mime ? 'primary' : 'outline'} onClick={() => changeFormat(f)}>
                {f.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              disabled={!outputUrl}
              onClick={() => {
                if (!outputUrl) return;
                const a = document.createElement('a');
                a.href = outputUrl;
                a.download = `converted.${format.ext}`;
                a.click();
              }}
            >
              <Download className="h-4 w-4" /> Download {format.label}
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
