'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function QrGenerator() {
  const [text, setText] = useState('https://novatools.app');
  const [dataUrl, setDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) {
      setDataUrl('');
      return;
    }
    QRCode.toDataURL(text, { width: 320, margin: 1, color: { dark: '#0B1120', light: '#FFFFFF' } })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [text]);

  function downloadPng() {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qr-code.png';
    a.click();
  }

  return (
    <ToolShell onReset={() => setText('')} shareSlug="qr-generator">
      <label className="block text-sm font-medium">Text or URL</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Enter a URL, text, or anything you want to encode"
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex flex-col items-center gap-4 rounded-xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/5">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Generated QR code" className="h-56 w-56 rounded-lg bg-white p-2 shadow-sm" />
        ) : (
          <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-dashed border-black/20 text-sm text-black/40 dark:border-white/20 dark:text-white/40">
            Enter text to generate
          </div>
        )}
        <Button variant="primary" size="sm" onClick={downloadPng} disabled={!dataUrl}>
          <Download className="h-4 w-4" />
          Download PNG
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </ToolShell>
  );
}
