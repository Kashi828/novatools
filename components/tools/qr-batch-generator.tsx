'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { PremiumGate } from '@/components/premium-gate';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download, Lock } from 'lucide-react';

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
            // eslint-disable-next-line @next/next/no-img-element
            <div key={i} className="space-y-1 text-center">
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
  return (
    <PremiumGate
      fallback={
        <div className="flex flex-col items-center gap-3 rounded-xl2 border border-black/10 p-12 text-center dark:border-white/10">
          <Lock className="h-8 w-8 text-gold-500" />
          <p className="font-medium">This is a Premium tool</p>
          <p className="max-w-sm text-sm text-black/50 dark:text-white/50">
            Sign in and subscribe to the Premium plan to generate QR codes in bulk. It&rsquo;s free to join — just requires an
            account.
          </p>
          <a href="/pricing" className="rounded-xl bg-gradient-premium px-4 py-2 text-sm font-medium text-white shadow-glow-gold">
            View plans
          </a>
        </div>
      }
    >
      <QrBatchGeneratorInner />
    </PremiumGate>
  );
}
