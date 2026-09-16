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

const CATEGORY_COLORS: Record<string, string> = {
  nonmetal: 'bg-primary-500',
  'noble gas': 'bg-secondary-500',
  'alkali metal': 'bg-danger',
  'alkaline earth': 'bg-warning',
  metalloid: 'bg-accent-500',
  halogen: 'bg-success',
  'post-transition metal': 'bg-primary-400',
  'transition metal': 'bg-secondary-400',
  lanthanide: 'bg-primary-700',
  actinide: 'bg-secondary-600',
  unknown: 'bg-black/30',
};

const ELEMENTS: Element[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: '1.008', category: 'nonmetal', group: 1, period: 1 },
  { number: 2, symbol: 'He', name: 'Helium', mass: '4.0026', category: 'noble gas', group: 18, period: 1 },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: '6.94', category: 'alkali metal', group: 1, period: 2 },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: '9.0122', category: 'alkaline earth', group: 2, period: 2 },
  { number: 5, symbol: 'B', name: 'Boron', mass: '10.81', category: 'metalloid', group: 13, period: 2 },
  { number: 6, symbol: 'C', name: 'Carbon', mass: '12.011', category: 'nonmetal', group: 14, period: 2 },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: '14.007', category: 'nonmetal', group: 15, period: 2 },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: '15.999', category: 'nonmetal', group: 16, period: 2 },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: '18.998', category: 'halogen', group: 17, period: 2 },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: '20.180', category: 'noble gas', group: 18, period: 2 },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: '22.990', category: 'alkali metal', group: 1, period: 3 },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: '24.305', category: 'alkaline earth', group: 2, period: 3 },
  { number: 13, symbol: 'Al', name: 'Aluminium', mass: '26.982', category: 'post-transition metal', group: 13, period: 3 },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: '28.085', category: 'metalloid', group: 14, period: 3 },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: '30.974', category: 'nonmetal', group: 15, period: 3 },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: '32.06', category: 'nonmetal', group: 16, period: 3 },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: '35.45', category: 'halogen', group: 17, period: 3 },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: '39.948', category: 'noble gas', group: 18, period: 3 },
  { number: 19, symbol: 'K', name: 'Potassium', mass: '39.098', category: 'alkali metal', group: 1, period: 4 },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: '40.078', category: 'alkaline earth', group: 2, period: 4 },
  { number: 21, symbol: 'Sc', name: 'Scandium', mass: '44.956', category: 'transition metal', group: 3, period: 4 },
  { number: 22, symbol: 'Ti', name: 'Titanium', mass: '47.867', category: 'transition metal', group: 4, period: 4 },
  { number: 23, symbol: 'V', name: 'Vanadium', mass: '50.942', category: 'transition metal', group: 5, period: 4 },
  { number: 24, symbol: 'Cr', name: 'Chromium', mass: '51.996', category: 'transition metal', group: 6, period: 4 },
  { number: 25, symbol: 'Mn', name: 'Manganese', mass: '54.938', category: 'transition metal', group: 7, period: 4 },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: '55.845', category: 'transition metal', group: 8, period: 4 },
  { number: 27, symbol: 'Co', name: 'Cobalt', mass: '58.933', category: 'transition metal', group: 9, period: 4 },
  { number: 28, symbol: 'Ni', name: 'Nickel', mass: '58.693', category: 'transition metal', group: 10, period: 4 },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: '63.546', category: 'transition metal', group: 11, period: 4 },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: '65.38', category: 'transition metal', group: 12, period: 4 },
  { number: 31, symbol: 'Ga', name: 'Gallium', mass: '69.723', category: 'post-transition metal', group: 13, period: 4 },
  { number: 32, symbol: 'Ge', name: 'Germanium', mass: '72.630', category: 'metalloid', group: 14, period: 4 },
  { number: 33, symbol: 'As', name: 'Arsenic', mass: '74.922', category: 'metalloid', group: 15, period: 4 },
  { number: 34, symbol: 'Se', name: 'Selenium', mass: '78.971', category: 'nonmetal', group: 16, period: 4 },
  { number: 35, symbol: 'Br', name: 'Bromine', mass: '79.904', category: 'halogen', group: 17, period: 4 },
  { number: 36, symbol: 'Kr', name: 'Krypton', mass: '83.798', category: 'noble gas', group: 18, period: 4 },
  { number: 37, symbol: 'Rb', name: 'Rubidium', mass: '85.468', category: 'alkali metal', group: 1, period: 5 },
  { number: 38, symbol: 'Sr', name: 'Strontium', mass: '87.62', category: 'alkaline earth', group: 2, period: 5 },
  { number: 39, symbol: 'Y', name: 'Yttrium', mass: '88.906', category: 'transition metal', group: 3, period: 5 },
  { number: 40, symbol: 'Zr', name: 'Zirconium', mass: '91.224', category: 'transition metal', group: 4, period: 5 },
  { number: 41, symbol: 'Nb', name: 'Niobium', mass: '92.906', category: 'transition metal', group: 5, period: 5 },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', mass: '95.95', category: 'transition metal', group: 6, period: 5 },
  { number: 43, symbol: 'Tc', name: 'Technetium', mass: '(98)', category: 'transition metal', group: 7, period: 5 },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', mass: '101.07', category: 'transition metal', group: 8, period: 5 },
  { number: 45, symbol: 'Rh', name: 'Rhodium', mass: '102.91', category: 'transition metal', group: 9, period: 5 },
  { number: 46, symbol: 'Pd', name: 'Palladium', mass: '106.42', category: 'transition metal', group: 10, period: 5 },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: '107.87', category: 'transition metal', group: 11, period: 5 },
  { number: 48, symbol: 'Cd', name: 'Cadmium', mass: '112.41', category: 'transition metal', group: 12, period: 5 },
  { number: 49, symbol: 'In', name: 'Indium', mass: '114.82', category: 'post-transition metal', group: 13, period: 5 },
  { number: 50, symbol: 'Sn', name: 'Tin', mass: '118.71', category: 'post-transition metal', group: 14, period: 5 },
  { number: 51, symbol: 'Sb', name: 'Antimony', mass: '121.76', category: 'metalloid', group: 15, period: 5 },
  { number: 52, symbol: 'Te', name: 'Tellurium', mass: '127.60', category: 'metalloid', group: 16, period: 5 },
  { number: 53, symbol: 'I', name: 'Iodine', mass: '126.90', category: 'halogen', group: 17, period: 5 },
  { number: 54, symbol: 'Xe', name: 'Xenon', mass: '131.29', category: 'noble gas', group: 18, period: 5 },
  { number: 55, symbol: 'Cs', name: 'Caesium', mass: '132.91', category: 'alkali metal', group: 1, period: 6 },
  { number: 56, symbol: 'Ba', name: 'Barium', mass: '137.33', category: 'alkaline earth', group: 2, period: 6 },
  { number: 57, symbol: 'La', name: 'Lanthanum', mass: '138.91', category: 'lanthanide', group: 3, period: 6 },
  { number: 58, symbol: 'Ce', name: 'Cerium', mass: '140.12', category: 'lanthanide', group: 3, period: 6 },
  { number: 59, symbol: 'Pr', name: 'Praseodymium', mass: '140.91', category: 'lanthanide', group: 3, period: 6 },
  { number: 60, symbol: 'Nd', name: 'Neodymium', mass: '144.24', category: 'lanthanide', group: 3, period: 6 },
  { number: 61, symbol: 'Pm', name: 'Promethium', mass: '(145)', category: 'lanthanide', group: 3, period: 6 },
  { number: 62, symbol: 'Sm', name: 'Samarium', mass: '150.36', category: 'lanthanide', group: 3, period: 6 },
  { number: 63, symbol: 'Eu', name: 'Europium', mass: '151.96', category: 'lanthanide', group: 3, period: 6 },
  { number: 64, symbol: 'Gd', name: 'Gadolinium', mass: '157.25', category: 'lanthanide', group: 3, period: 6 },
  { number: 65, symbol: 'Tb', name: 'Terbium', mass: '158.93', category: 'lanthanide', group: 3, period: 6 },
  { number: 66, symbol: 'Dy', name: 'Dysprosium', mass: '162.50', category: 'lanthanide', group: 3, period: 6 },
  { number: 67, symbol: 'Ho', name: 'Holmium', mass: '164.93', category: 'lanthanide', group: 3, period: 6 },
  { number: 68, symbol: 'Er', name: 'Erbium', mass: '167.26', category: 'lanthanide', group: 3, period: 6 },
  { number: 69, symbol: 'Tm', name: 'Thulium', mass: '168.93', category: 'lanthanide', group: 3, period: 6 },
  { number: 70, symbol: 'Yb', name: 'Ytterbium', mass: '173.05', category: 'lanthanide', group: 3, period: 6 },
  { number: 71, symbol: 'Lu', name: 'Lutetium', mass: '174.97', category: 'lanthanide', group: 3, period: 6 },
  { number: 72, symbol: 'Hf', name: 'Hafnium', mass: '178.49', category: 'transition metal', group: 4, period: 6 },
  { number: 73, symbol: 'Ta', name: 'Tantalum', mass: '180.95', category: 'transition metal', group: 5, period: 6 },
  { number: 74, symbol: 'W', name: 'Tungsten', mass: '183.84', category: 'transition metal', group: 6, period: 6 },
  { number: 75, symbol: 'Re', name: 'Rhenium', mass: '186.21', category: 'transition metal', group: 7, period: 6 },
  { number: 76, symbol: 'Os', name: 'Osmium', mass: '190.23', category: 'transition metal', group: 8, period: 6 },
  { number: 77, symbol: 'Ir', name: 'Iridium', mass: '192.22', category: 'transition metal', group: 9, period: 6 },
  { number: 78, symbol: 'Pt', name: 'Platinum', mass: '195.08', category: 'transition metal', group: 10, period: 6 },
  { number: 79, symbol: 'Au', name: 'Gold', mass: '196.97', category: 'transition metal', group: 11, period: 6 },
  { number: 80, symbol: 'Hg', name: 'Mercury', mass: '200.59', category: 'transition metal', group: 12, period: 6 },
  { number: 81, symbol: 'Tl', name: 'Thallium', mass: '204.38', category: 'post-transition metal', group: 13, period: 6 },
  { number: 82, symbol: 'Pb', name: 'Lead', mass: '207.2', category: 'post-transition metal', group: 14, period: 6 },
  { number: 83, symbol: 'Bi', name: 'Bismuth', mass: '208.98', category: 'post-transition metal', group: 15, period: 6 },
  { number: 84, symbol: 'Po', name: 'Polonium', mass: '(209)', category: 'metalloid', group: 16, period: 6 },
  { number: 85, symbol: 'At', name: 'Astatine', mass: '(210)', category: 'halogen', group: 17, period: 6 },
  { number: 86, symbol: 'Rn', name: 'Radon', mass: '(222)', category: 'noble gas', group: 18, period: 6 },
  { number: 87, symbol: 'Fr', name: 'Francium', mass: '(223)', category: 'alkali metal', group: 1, period: 7 },
  { number: 88, symbol: 'Ra', name: 'Radium', mass: '(226)', category: 'alkaline earth', group: 2, period: 7 },
  { number: 89, symbol: 'Ac', name: 'Actinium', mass: '(227)', category: 'actinide', group: 3, period: 7 },
  { number: 90, symbol: 'Th', name: 'Thorium', mass: '232.04', category: 'actinide', group: 3, period: 7 },
  { number: 91, symbol: 'Pa', name: 'Protactinium', mass: '231.04', category: 'actinide', group: 3, period: 7 },
  { number: 92, symbol: 'U', name: 'Uranium', mass: '238.03', category: 'actinide', group: 3, period: 7 },
  { number: 93, symbol: 'Np', name: 'Neptunium', mass: '(237)', category: 'actinide', group: 3, period: 7 },
  { number: 94, symbol: 'Pu', name: 'Plutonium', mass: '(244)', category: 'actinide', group: 3, period: 7 },
  { number: 95, symbol: 'Am', name: 'Americium', mass: '(243)', category: 'actinide', group: 3, period: 7 },
  { number: 96, symbol: 'Cm', name: 'Curium', mass: '(247)', category: 'actinide', group: 3, period: 7 },
  { number: 97, symbol: 'Bk', name: 'Berkelium', mass: '(247)', category: 'actinide', group: 3, period: 7 },
  { number: 98, symbol: 'Cf', name: 'Californium', mass: '(251)', category: 'actinide', group: 3, period: 7 },
  { number: 99, symbol: 'Es', name: 'Einsteinium', mass: '(252)', category: 'actinide', group: 3, period: 7 },
  { number: 100, symbol: 'Fm', name: 'Fermium', mass: '(257)', category: 'actinide', group: 3, period: 7 },
  { number: 101, symbol: 'Md', name: 'Mendelevium', mass: '(258)', category: 'actinide', group: 3, period: 7 },
  { number: 102, symbol: 'No', name: 'Nobelium', mass: '(259)', category: 'actinide', group: 3, period: 7 },
  { number: 103, symbol: 'Lr', name: 'Lawrencium', mass: '(266)', category: 'actinide', group: 3, period: 7 },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', mass: '(267)', category: 'transition metal', group: 4, period: 7 },
  { number: 105, symbol: 'Db', name: 'Dubnium', mass: '(268)', category: 'transition metal', group: 5, period: 7 },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', mass: '(269)', category: 'transition metal', group: 6, period: 7 },
  { number: 107, symbol: 'Bh', name: 'Bohrium', mass: '(270)', category: 'transition metal', group: 7, period: 7 },
  { number: 108, symbol: 'Hs', name: 'Hassium', mass: '(269)', category: 'transition metal', group: 8, period: 7 },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', mass: '(278)', category: 'unknown', group: 9, period: 7 },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', mass: '(281)', category: 'unknown', group: 10, period: 7 },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', mass: '(282)', category: 'unknown', group: 11, period: 7 },
  { number: 112, symbol: 'Cn', name: 'Copernicium', mass: '(285)', category: 'transition metal', group: 12, period: 7 },
  { number: 113, symbol: 'Nh', name: 'Nihonium', mass: '(286)', category: 'post-transition metal', group: 13, period: 7 },
  { number: 114, symbol: 'Fl', name: 'Flerovium', mass: '(289)', category: 'post-transition metal', group: 14, period: 7 },
  { number: 115, symbol: 'Mc', name: 'Moscovium', mass: '(290)', category: 'post-transition metal', group: 15, period: 7 },
  { number: 116, symbol: 'Lv', name: 'Livermorium', mass: '(293)', category: 'post-transition metal', group: 16, period: 7 },
  { number: 117, symbol: 'Ts', name: 'Tennessine', mass: '(294)', category: 'halogen', group: 17, period: 7 },
  { number: 118, symbol: 'Og', name: 'Oganesson', mass: '(294)', category: 'noble gas', group: 18, period: 7 },
];

export function PeriodicTable() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Element | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ELEMENTS;
    return ELEMENTS.filter(
      (e) => e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q || String(e.number) === q
    );
  }, [query]);

  return (
    <ToolShell shareSlug="periodic-table">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, symbol, or atomic number..."
        className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex flex-wrap gap-2 text-[10px]">
        {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'unknown').map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1 text-black/50 dark:text-white/50">
            <span className={`h-2.5 w-2.5 rounded-sm ${color}`} /> {cat}
          </span>
        ))}
      </div>

      <div className="grid max-h-96 grid-cols-6 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-9 lg:grid-cols-10">
        {filtered.map((el) => (
          <button
            key={el.number}
            onClick={() => setSelected(el)}
            className={`flex aspect-square flex-col items-center justify-center rounded-md text-white transition-transform hover:z-10 hover:scale-110 ${CATEGORY_COLORS[el.category] ?? 'bg-black/30'}`}
          >
            <span className="text-[7px] opacity-80">{el.number}</span>
            <span className="text-xs font-bold sm:text-sm">{el.symbol}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-black/40 dark:text-white/40">
            No element matches &ldquo;{query}&rdquo;.
          </p>
        )}
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
              <p className="text-sm text-black/60 dark:text-white/60">
                Atomic mass: {selected.mass} &middot; {selected.category} &middot; Group {selected.group}, Period {selected.period}
              </p>
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-black/40 dark:text-white/40">All 118 confirmed chemical elements, IUPAC-recognized.</p>
    </ToolShell>
  );
}
