'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LineItem {
  description: string;
  quantity: string;
  price: string;
}

export function InvoiceGenerator() {
  const [from, setFrom] = useState('Your Business Name');
  const [to, setTo] = useState('Client Name');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [taxRate, setTaxRate] = useState('0');
  const [items, setItems] = useState<LineItem[]>([{ description: 'Design services', quantity: '1', price: '500' }]);

  function updateItem(i: number, field: keyof LineItem, value: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: '', quantity: '1', price: '0' }]);
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((sum, it) => sum + (parseFloat(it.quantity) || 0) * (parseFloat(it.price) || 0), 0);
    const t = sub * ((parseFloat(taxRate) || 0) / 100);
    return { subtotal: sub, tax: t, total: sub + t };
  }, [items, taxRate]);

  const fmt = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  const invoiceText = `INVOICE ${invoiceNumber}\nDate: ${date}\n\nFrom: ${from}\nTo: ${to}\n\n${items
    .map((it) => `${it.description} — ${it.quantity} x ${fmt(parseFloat(it.price) || 0)} = ${fmt((parseFloat(it.quantity) || 0) * (parseFloat(it.price) || 0))}`)
    .join('\n')}\n\nSubtotal: ${fmt(subtotal)}\nTax (${taxRate}%): ${fmt(tax)}\nTotal: ${fmt(total)}`;

  return (
    <ToolShell outputValue={invoiceText} downloadFilename={`${invoiceNumber}.txt`} shareSlug="invoice-generator">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">From</label>
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">To</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Invoice #</label>
          <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        </div>
      </div>

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_90px_auto] items-center gap-2">
            <input value={it.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Description" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            <input type="number" value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            <input type="number" value={it.price} onChange={(e) => updateItem(i, 'price', e.target.value)} placeholder="Price" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            <button onClick={() => removeItem(i)} className="text-black/30 hover:text-danger dark:text-white/30"><X className="h-4 w-4" /></button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addItem}>+ Add line item</Button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Tax rate (%)</label>
        <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-24 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
      </div>

      <div className="space-y-1 rounded-xl2 border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{fmt(tax)}</span></div>
        <div className="flex justify-between border-t border-black/10 pt-1 font-heading text-lg font-bold dark:border-white/10"><span>Total</span><span>{fmt(total)}</span></div>
      </div>
    </ToolShell>
  );
}
