'use client';

import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const FORMATS = ['CODE128', 'EAN13', 'UPC', 'CODE39', 'ITF14'];

export function BarcodeGenerator() {
  const [value, setValue] = useState('4006381333931');
  const [format, setFormat] = useState('CODE128');
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    try {
      JsBarcode(canvasRef.current, value, {
        format,
        width: 2,
        height: 100,
        displayValue: true,
        background: 'transparent',
        lineColor: '#0B1120',
      });
      setError(null);
    } catch {
      setError(`"${value}" isn't valid for ${format} format.`);
    }
  }, [value, format]);

  return (
    <ToolShell onReset={() => setValue('')} shareSlug="barcode-generator">
      <div>
        <label className="mb-1 block text-sm font-medium">Value</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FORMATS.map((f) => (
          <Button key={f} size="sm" variant={format === f ? 'primary' : 'outline'} onClick={() => setFormat(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10">
        {error ? <p className="text-sm text-danger">{error}</p> : <canvas ref={canvasRef} />}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={!!error}
        onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'barcode.png';
          a.click();
        }}
      >
        <Download className="h-4 w-4" /> Download PNG
      </Button>
    </ToolShell>
  );
}
