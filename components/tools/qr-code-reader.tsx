'use client';

import { useState } from 'react';
import jsQR from 'jsqr';
import { ToolShell } from '@/components/tool-shell';
import { UploadCloud } from 'lucide-react';

export function QrCodeReader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setResult(code.data);
      } else {
        setError('No QR code found in this image.');
      }
    };
    img.src = url;
  }

  return (
    <ToolShell outputValue={result ?? undefined} shareSlug="qr-code-reader">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl2 border-2 border-dashed border-black/15 p-10 text-center dark:border-white/15">
        <UploadCloud className="h-8 w-8 text-black/30 dark:text-white/30" />
        <span className="text-sm font-medium">Click to upload an image with a QR code</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>

      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Uploaded" className="mx-auto max-h-56 rounded-xl border border-black/10 dark:border-white/10" />
      )}

      {error && <p className="text-center text-sm text-danger">{error}</p>}

      {result && (
        <div className="rounded-xl border border-primary-400/30 bg-primary-50 p-4 text-center dark:bg-primary-500/10">
          <p className="text-xs text-black/50 dark:text-white/50">Decoded content</p>
          <p className="mt-1 break-all font-mono text-sm">{result}</p>
        </div>
      )}
    </ToolShell>
  );
}
