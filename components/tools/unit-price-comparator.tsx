'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

interface Product {
  name: string;
  price: string;
  quantity: string;
}

export function UnitPriceComparator() {
  const [products, setProducts] = useState<Product[]>([
    { name: 'Brand A (500g)', price: '4.99', quantity: '500' },
    { name: 'Brand B (750g)', price: '6.99', quantity: '750' },
  ]);

  function update(i: number, field: keyof Product, val: string) {
    setProducts((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }
  function addProduct() {
    setProducts((prev) => [...prev, { name: `Option ${prev.length + 1}`, price: '', quantity: '' }]);
  }
  function removeProduct(i: number) {
    setProducts((prev) => prev.filter((_, idx) => idx !== i));
  }

  const withUnitPrice = useMemo(
    () =>
      products.map((p) => {
        const price = parseFloat(p.price);
        const qty = parseFloat(p.quantity);
        const unitPrice = price && qty ? price / qty : null;
        return { ...p, unitPrice };
      }),
    [products]
  );

  const cheapest = withUnitPrice.reduce<number | null>((best, p) => {
    if (p.unitPrice === null) return best;
    if (best === null || p.unitPrice < best) return p.unitPrice;
    return best;
  }, null);

  return (
    <ToolShell shareSlug="unit-price-comparator">
      <div className="space-y-3">
        {products.map((p, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10">
            <div>
              <label className="mb-1 block text-xs text-black/50 dark:text-white/50">Name</label>
              <input value={p.name} onChange={(e) => update(i, 'name', e.target.value)} className="w-full rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-black/50 dark:text-white/50">Price</label>
              <input type="number" value={p.price} onChange={(e) => update(i, 'price', e.target.value)} className="w-24 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-black/50 dark:text-white/50">Quantity</label>
              <input type="number" value={p.quantity} onChange={(e) => update(i, 'quantity', e.target.value)} className="w-24 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
            </div>
            <button onClick={() => removeProduct(i)} className="mb-2 text-xs text-danger">Remove</button>
          </div>
        ))}
        <button onClick={addProduct} className="text-sm text-primary-500 hover:underline">+ Add another option</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {withUnitPrice.map((p, i) => (
          <div
            key={i}
            className={`rounded-xl2 border p-4 text-center ${
              p.unitPrice !== null && p.unitPrice === cheapest
                ? 'border-primary-400/40 bg-primary-50 dark:bg-primary-500/10'
                : 'border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/5'
            }`}
          >
            <div className="text-sm text-black/60 dark:text-white/60">{p.name}</div>
            <div className="font-heading text-xl font-bold">
              {p.unitPrice !== null ? `$${p.unitPrice.toFixed(4)} / unit` : '—'}
            </div>
            {p.unitPrice !== null && p.unitPrice === cheapest && <div className="text-xs font-medium text-primary-600 dark:text-primary-400">Best value</div>}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
