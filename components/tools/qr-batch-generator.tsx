'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function QrBatchGeneratorInner() {
  const [input, setInput] = useState('https://novatools.example.com\nhttps://github.com\nhello world');
  const [results, setResults] = useState<{ text: string; dataUrl: string }[]>([]);
  const [generating, setGenerating] = useState(false);

  async function generateAll() {
    setGenerating(true);
    const lines = input.split('\n').map((l) => l.trim()).filter(Boolean);
    const generated = await Promise.all(
      lines.map(async (text) => ({
        text,
        dataUrl: await QRCode.toDataURL(text, { width: 320, margin: 1, color: { dark: '#0B1120', light: '#FFFFFF' } }),
      }))
    );
    setResults(generated);
    setGenerating(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    results.forEach((r, i) => {
      const base64 = r.dataUrl.split(',')[1];
      zip.file(`qr-${i + 1}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qr-codes.zip';
    a.click();
  }

  return (
    <ToolShell shareSlug="qr-batch-generator">
      <label className="mb-1 block text-sm font-medium">One value per line</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="https://example.com&#10;another value&#10;..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 font-mono text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex gap-2">
        <Button disabled={generating} onClick={generateAll}>
          {generating ? 'Generating...' : 'Generate all'}
        </Button>
        {results.length > 0 && (
          <Button variant="outline" onClick={downloadZip}>
            <Download className="h-4 w-4" /> Download all as .zip
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {results.map((r, i) => (
            <div key={i} className="space-y-1 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.dataUrl} alt={r.text} className="w-full rounded-lg bg-white p-1" />
              <p className="truncate text-xs text-black/50 dark:text-white/50">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

export function QrBatchGenerator() {
  return <QrBatchGeneratorInner />;
}
