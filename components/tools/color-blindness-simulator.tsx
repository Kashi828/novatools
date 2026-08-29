'use client';

import { useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { ImageDropzone } from '@/components/image-dropzone';
import { Button } from '@/components/ui/button';

const MATRICES: Record<string, number[]> = {
  Protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  Deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  Tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
};

export function ColorBlindnessSimulator() {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    const img = new Image();
    img.onload = () => {
      const results: Record<string, string> = {};
      for (const [name, m] of Object.entries(MATRICES)) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          d[i] = r * m[0] + g * m[1] + b * m[2];
          d[i + 1] = r * m[3] + g * m[4] + b * m[5];
          d[i + 2] = r * m[6] + g * m[7] + b * m[8];
        }
        ctx.putImageData(imageData, 0, 0);
        results[name] = canvas.toDataURL('image/png');
      }
      setOutputs(results);
    };
    img.src = url;
  }

  return (
    <ToolShell shareSlug="color-blindness-simulator">
      {!srcUrl && <ImageDropzone onFile={handleFile} />}

      {srcUrl && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-black/50 dark:text-white/50">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Original" className="w-full rounded-xl border border-black/10 dark:border-white/10" />
            </div>
            {Object.entries(outputs).map(([name, url]) => (
              <div key={name}>
                <p className="mb-1 text-xs text-black/50 dark:text-white/50">{name}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={name} className="w-full rounded-xl border border-black/10 dark:border-white/10" />
              </div>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setSrcUrl(null)}>Choose a different image</Button>
        </div>
      )}
      <p className="text-xs text-black/40 dark:text-white/40">Simulates how an image appears under the three most common forms of color vision deficiency.</p>
    </ToolShell>
  );
}
