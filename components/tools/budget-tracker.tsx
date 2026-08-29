'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Entry {
  id: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
}

const STORAGE_KEY = 'novatools-budget-tracker';

export function BudgetTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {
        // Ignore malformed data.
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, loaded]);

  function addEntry() {
    if (!description.trim() || !amount) return;
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), description, amount, type }]);
    setDescription('');
    setAmount('');
  }
  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const { income, expenses, balance } = useMemo(() => {
    const inc = entries.filter((e) => e.type === 'income').reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const exp = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    return { income: inc, expenses: exp, balance: inc - exp };
  }, [entries]);

  const fmt = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <ToolShell outputValue={`Income: ${fmt(income)} | Expenses: ${fmt(expenses)} | Balance: ${fmt(balance)}`} shareSlug="budget-tracker">
      <div className="flex flex-wrap items-end gap-2">
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="w-28 rounded-lg border border-black/10 bg-white/60 p-2 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <div className="flex gap-1">
          <Button size="sm" variant={type === 'income' ? 'primary' : 'outline'} onClick={() => setType('income')}>Income</Button>
          <Button size="sm" variant={type === 'expense' ? 'primary' : 'outline'} onClick={() => setType('expense')}>Expense</Button>
        </div>
        <Button size="sm" onClick={addEntry}>Add</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl2 border border-success/30 bg-success/5 p-4 text-center">
          <div className="font-heading text-xl font-bold text-success">{fmt(income)}</div>
          <div className="text-xs text-black/50 dark:text-white/50">Income</div>
        </div>
        <div className="rounded-xl2 border border-danger/30 bg-danger/5 p-4 text-center">
          <div className="font-heading text-xl font-bold text-danger">{fmt(expenses)}</div>
          <div className="text-xs text-black/50 dark:text-white/50">Expenses</div>
        </div>
        <div className={`rounded-xl2 border p-4 text-center ${balance >= 0 ? 'border-primary-400/30 bg-primary-50 dark:bg-primary-500/10' : 'border-danger/30 bg-danger/5'}`}>
          <div className={`font-heading text-xl font-bold ${balance >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger'}`}>{fmt(balance)}</div>
          <div className="text-xs text-black/50 dark:text-white/50">Balance</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {entries.slice().reverse().map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
            <span>{e.description}</span>
            <div className="flex items-center gap-3">
              <span className={e.type === 'income' ? 'text-success' : 'text-danger'}>{e.type === 'income' ? '+' : '-'}{fmt(parseFloat(e.amount) || 0)}</span>
              <button onClick={() => removeEntry(e.id)} className="text-black/30 hover:text-danger dark:text-white/30"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">Saved only in this browser.</p>
    </ToolShell>
  );
}
