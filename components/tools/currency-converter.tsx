'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CNY', 'SGD', 'AED', 'CHF', 'ZAR'];

interface RatesState {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [data, setData] = useState<RatesState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        if (!res.ok) throw new Error('Failed to fetch exchange rates');
        const json = await res.json();
        if (json.result !== 'success') throw new Error('Exchange rate provider returned an error');
        if (!cancelled) {
          setData({ base: json.base_code, rates: json.rates, updatedAt: json.time_last_update_utc });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load exchange rates');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRates();
    return () => {
      cancelled = true;
    };
  }, [from]);

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    if (!data || isNaN(amt) || !data.rates[to]) return null;
    return amt * data.rates[to];
  }, [amount, data, to]);

  return (
    <ToolShell
      outputValue={result !== null ? `${amount} ${from} = ${result.toFixed(2)} ${to}` : undefined}
      shareSlug="currency-converter"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="mb-1 block text-sm font-medium">From</label>
          <Select value={from} onChange={setFrom} options={COMMON_CURRENCIES} />
        </div>
        <div className="flex items-end justify-center pb-2">
          <button
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 hover:border-primary-400/50 dark:border-white/10"
            aria-label="Swap currencies"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">To</label>
          <Select value={to} onChange={setTo} options={COMMON_CURRENCIES} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-black/50 dark:text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" /> Fetching live rates...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}. <Button size="sm" variant="outline" className="mt-2" onClick={() => setFrom((f) => f)}>Retry</Button>
        </div>
      )}

      {!loading && !error && result !== null && (
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 text-center dark:border-white/10 dark:bg-white/5">
          <div className="font-heading text-3xl font-bold">
            {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </div>
          {data && <div className="mt-1 text-xs text-black/40 dark:text-white/40">Rates updated {data.updatedAt}</div>}
        </div>
      )}
    </ToolShell>
  );
}
