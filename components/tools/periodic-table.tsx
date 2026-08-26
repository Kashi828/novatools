'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';

interface Element {
  symbol: string;
  name: string;
  number: number;
  mass: string;
  category: string;
  group: number;
  period: number;
}

// A compact but real dataset covering the first 4 periods (the ones students look up most).
const ELEMENTS: Element[] = [
  { symbol: 'H', name: 'Hydrogen', number: 1, mass: '1.008', category: 'nonmetal', group: 1, period: 1 },
  { symbol: 'He', name: 'Helium', number: 2, mass: '4.003', category: 'noble gas', group: 18, period: 1 },
  { symbol: 'Li', name: 'Lithium', number: 3, mass: '6.94', category: 'alkali metal', group: 1, period: 2 },
  { symbol: 'Be', name: 'Beryllium', number: 4, mass: '9.012', category: 'alkaline earth', group: 2, period: 2 },
  { symbol: 'B', name: 'Boron', number: 5, mass: '10.81', category: 'metalloid', group: 13, period: 2 },
  { symbol: 'C', name: 'Carbon', number: 6, mass: '12.011', category: 'nonmetal', group: 14, period: 2 },
  { symbol: 'N', name: 'Nitrogen', number: 7, mass: '14.007', category: 'nonmetal', group: 15, period: 2 },
  { symbol: 'O', name: 'Oxygen', number: 8, mass: '15.999', category: 'nonmetal', group: 16, period: 2 },
  { symbol: 'F', name: 'Fluorine', number: 9, mass: '18.998', category: 'halogen', group: 17, period: 2 },
  { symbol: 'Ne', name: 'Neon', number: 10, mass: '20.180', category: 'noble gas', group: 18, period: 2 },
  { symbol: 'Na', name: 'Sodium', number: 11, mass: '22.990', category: 'alkali metal', group: 1, period: 3 },
  { symbol: 'Mg', name: 'Magnesium', number: 12, mass: '24.305', category: 'alkaline earth', group: 2, period: 3 },
  { symbol: 'Al', name: 'Aluminium', number: 13, mass: '26.982', category: 'post-transition metal', group: 13, period: 3 },
  { symbol: 'Si', name: 'Silicon', number: 14, mass: '28.085', category: 'metalloid', group: 14, period: 3 },
  { symbol: 'P', name: 'Phosphorus', number: 15, mass: '30.974', category: 'nonmetal', group: 15, period: 3 },
  { symbol: 'S', name: 'Sulfur', number: 16, mass: '32.06', category: 'nonmetal', group: 16, period: 3 },
  { symbol: 'Cl', name: 'Chlorine', number: 17, mass: '35.45', category: 'halogen', group: 17, period: 3 },
  { symbol: 'Ar', name: 'Argon', number: 18, mass: '39.948', category: 'noble gas', group: 18, period: 3 },
  { symbol: 'K', name: 'Potassium', number: 19, mass: '39.098', category: 'alkali metal', group: 1, period: 4 },
  { symbol: 'Ca', name: 'Calcium', number: 20, mass: '40.078', category: 'alkaline earth', group: 2, period: 4 },
  { symbol: 'Fe', name: 'Iron', number: 26, mass: '55.845', category: 'transition metal', group: 8, period: 4 },
  { symbol: 'Cu', name: 'Copper', number: 29, mass: '63.546', category: 'transition metal', group: 11, period: 4 },
  { symbol: 'Zn', name: 'Zinc', number: 30, mass: '65.38', category: 'transition metal', group: 12, period: 4 },
  { symbol: 'Ag', name: 'Silver', number: 47, mass: '107.87', category: 'transition metal', group: 11, period: 5 },
  { symbol: 'Au', name: 'Gold', number: 79, mass: '196.97', category: 'transition metal', group: 11, period: 6 },
];

const CATEGORY_COLORS: Record<string, string> = {
  nonmetal: 'bg-primary-500',
  'noble gas': 'bg-secondary-500',
  'alkali metal': 'bg-danger',
  'alkaline earth': 'bg-warning',
  metalloid: 'bg-accent-500',
  halogen: 'bg-success',
  'post-transition metal': 'bg-primary-400',
  'transition metal': 'bg-secondary-400',
};

export function PeriodicTable() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Element | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ELEMENTS;
    return ELEMENTS.filter((e) => e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q || String(e.number) === q);
  }, [query]);

  return (
    <ToolShell shareSlug="periodic-table">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, symbol, or atomic number..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {filtered.map((el) => (
          <button
            key={el.number}
            onClick={() => setSelected(el)}
            className={`flex aspect-square flex-col items-center justify-center rounded-lg text-white transition-transform hover:scale-105 ${CATEGORY_COLORS[el.category] ?? 'bg-black/30'}`}
          >
            <span className="text-[9px] opacity-80">{el.number}</span>
            <span className="text-lg font-bold">{el.symbol}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-6 text-center text-sm text-black/40 dark:text-white/40">No element matches &ldquo;{query}&rdquo;.</p>}
      </div>

      {selected && (
        <div className="rounded-xl2 border border-primary-400/30 bg-primary-50 p-5 dark:bg-primary-500/10">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-xl text-white ${CATEGORY_COLORS[selected.category] ?? 'bg-black/30'}`}>
              <span className="text-xs opacity-80">{selected.number}</span>
              <span className="text-2xl font-bold">{selected.symbol}</span>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold">{selected.name}</h3>
              <p className="text-sm text-black/60 dark:text-white/60">Atomic mass: {selected.mass} · {selected.category} · Group {selected.group}, Period {selected.period}</p>
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-black/40 dark:text-white/40">A curated set of commonly referenced elements (periods 1-6) — not the full 118-element table.</p>
    </ToolShell>
  );
}
