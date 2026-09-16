'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function VcardQrGenerator() {
  const [name, setName] = useState('Jane Doe');
  const [phone, setPhone] = useState('+1 555 123 4567');
  const [email, setEmail] = useState('jane@example.com');
  const [company, setCompany] = useState('NovaTools');
  const [dataUrl, setDataUrl] = useState('');

  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${company}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;

  useEffect(() => {
    QRCode.toDataURL(vcard, { width: 320, margin: 1, color: { dark: '#0B1120', light: '#FFFFFF' } })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [vcard]);

  return (
    <ToolShell outputValue={vcard} downloadFilename="contact.vcf" shareSlug="vcard-qr-generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/5">
        {dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Contact QR code" className="h-56 w-56 rounded-lg bg-white p-2 shadow-sm" />
        )}
        <p className="text-xs text-black/50 dark:text-white/50">Scanning this saves the contact directly to a phone</p>
        <Button
          size="sm"
          onClick={() => {
            if (!dataUrl) return;
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'contact-qr.png';
            a.click();
          }}
        >
          <Download className="h-4 w-4" /> Download PNG
        </Button>
      </div>
    </ToolShell>
  );
}
