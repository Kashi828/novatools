'use client';

import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

type Mode = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'speed' | 'pressure' | 'energy' | 'power' | 'data' | 'fuel';
type Unit = { label: string; factor: number };
type Config = { label: string; units: Record<string, Unit> };

const CONFIGS: Record<Exclude<Mode, 'temperature' | 'fuel'>, Config> = {
  length: { label: 'Length', units: { mm: { label: 'Millimeter', factor: 0.001 }, cm: { label: 'Centimeter', factor: 0.01 }, m: { label: 'Meter', factor: 1 }, km: { label: 'Kilometer', factor: 1000 }, in: { label: 'Inch', factor: 0.0254 }, ft: { label: 'Foot', factor: 0.3048 }, yd: { label: 'Yard', factor: 0.9144 }, mi: { label: 'Mile', factor: 1609.344 }, nmi: { label: 'Nautical mile', factor: 1852 } } },
  weight: { label: 'Weight / Mass', units: { mg: { label: 'Milligram', factor: 0.000001 }, g: { label: 'Gram', factor: 0.001 }, kg: { label: 'Kilogram', factor: 1 }, t: { label: 'Tonne', factor: 1000 }, oz: { label: 'Ounce', factor: 0.028349523125 }, lb: { label: 'Pound', factor: 0.45359237 }, stone: { label: 'Stone', factor: 6.35029318 } } },
  volume: { label: 'Volume', units: { ml: { label: 'Milliliter', factor: 0.001 }, l: { label: 'Liter', factor: 1 }, m3: { label: 'Cubic meter', factor: 1000 }, tsp: { label: 'Teaspoon', factor: 0.00492892159 }, tbsp: { label: 'Tablespoon', factor: 0.0147867648 }, cup: { label: 'Cup', factor: 0.236588237 }, gal: { label: 'US gallon', factor: 3.785411784 }, qt: { label: 'US quart', factor: 0.946352946 } } },
  area: { label: 'Area', units: { mm2: { label: 'Square millimeter', factor: 0.000001 }, cm2: { label: 'Square centimeter', factor: 0.0001 }, m2: { label: 'Square meter', factor: 1 }, km2: { label: 'Square kilometer', factor: 1000000 }, ft2: { label: 'Square foot', factor: 0.09290304 }, yd2: { label: 'Square yard', factor: 0.83612736 }, acre: { label: 'Acre', factor: 4046.8564224 }, hectare: { label: 'Hectare', factor: 10000 } } },
  speed: { label: 'Speed', units: { mps: { label: 'Meters / second', factor: 1 }, kph: { label: 'Kilometers / hour', factor: 0.2777777778 }, mph: { label: 'Miles / hour', factor: 0.44704 }, knot: { label: 'Knot', factor: 0.5144444444 } } },
  pressure: { label: 'Pressure', units: { pa: { label: 'Pascal', factor: 1 }, kpa: { label: 'Kilopascal', factor: 1000 }, bar: { label: 'Bar', factor: 100000 }, psi: { label: 'PSI', factor: 6894.757293 }, atm: { label: 'Atmosphere', factor: 101325 }, mmhg: { label: 'mmHg', factor: 133.322387 } } },
  energy: { label: 'Energy', units: { j: { label: 'Joule', factor: 1 }, kj: { label: 'Kilojoule', factor: 1000 }, wh: { label: 'Watt-hour', factor: 3600 }, kwh: { label: 'Kilowatt-hour', factor: 3600000 }, cal: { label: 'Calorie', factor: 4.184 }, kcal: { label: 'Kilocalorie', factor: 4184 }, btu: { label: 'BTU', factor: 1055.05585262 } } },
  power: { label: 'Power', units: { w: { label: 'Watt', factor: 1 }, kw: { label: 'Kilowatt', factor: 1000 }, mw: { label: 'Megawatt', factor: 1000000 }, hp: { label: 'Horsepower', factor: 745.699872 }, btu: { label: 'BTU / hour', factor: 0.29307107 } } },
  data: { label: 'Digital Storage', units: { bit: { label: 'Bit', factor: 0.125 }, b: { label: 'Byte', factor: 1 }, kb: { label: 'KB (decimal)', factor: 1000 }, mb: { label: 'MB (decimal)', factor: 1000000 }, gb: { label: 'GB (decimal)', factor: 1000000000 }, tb: { label: 'TB (decimal)', factor: 1000000000000 }, kib: { label: 'KiB', factor: 1024 }, mib: { label: 'MiB', factor: 1048576 }, gib: { label: 'GiB', factor: 1073741824 }, tib: { label: 'TiB', factor: 1099511627776 } } },
};

const MODES: { key: Mode; label: string }[] = [
  { key: 'length', label: 'Length' }, { key: 'weight', label: 'Weight' }, { key: 'temperature', label: 'Temperature' },
  { key: 'volume', label: 'Volume' }, { key: 'area', label: 'Area' }, { key: 'speed', label: 'Speed' },
  { key: 'pressure', label: 'Pressure' }, { key: 'energy', label: 'Energy' }, { key: 'power', label: 'Power' },
  { key: 'data', label: 'Data' }, { key: 'fuel', label: 'Fuel economy' },
];

const inputClass = 'w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5';

function temperature(value: number, from: string, to: string) {
  let c = value;
  if (from === 'f') c = (value - 32) * 5 / 9;
  if (from === 'k') c = value - 273.15;
  if (to === 'f') return c * 9 / 5 + 32;
  if (to === 'k') return c + 273.15;
  return c;
}

function fuel(value: number, from: string, to: string) {
  if (from === to) return value;
  const lPer100 = from === 'l100' ? value : from === 'kmpl' ? 100 / value : 235.214583 / value;
  if (to === 'l100') return lPer100;
  if (to === 'kmpl') return 100 / lPer100;
  return 235.214583 / lPer100;
}

function format(value: number) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }).format(value);
}

export function ConverterSuite() {
  const [mode, setMode] = useState<Mode>('length');
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');

  const units = useMemo(() => {
    if (mode === 'temperature') return [{ value: 'c', label: 'Celsius (°C)' }, { value: 'f', label: 'Fahrenheit (°F)' }, { value: 'k', label: 'Kelvin (K)' }];
    if (mode === 'fuel') return [{ value: 'l100', label: 'Liters / 100 km' }, { value: 'kmpl', label: 'Kilometers / liter' }, { value: 'mpg', label: 'Miles / gallon' }];
    return Object.entries(CONFIGS[mode].units).map(([key, item]) => ({ value: key, label: item.label }));
  }, [mode]);

  const result = useMemo(() => {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    if (mode === 'temperature') return temperature(n, from, to);
    if (mode === 'fuel') return fuel(n, from, to);
    const config = CONFIGS[mode];
    return (n * config.units[from].factor) / config.units[to].factor;
  }, [value, from, to, mode]);

  function changeMode(next: Mode) {
    setMode(next);
    const keys = next === 'temperature' ? ['c', 'f'] : next === 'fuel' ? ['l100', 'kmpl'] : Object.keys(CONFIGS[next].units);
    setFrom(keys[0]);
    setTo(keys[1] ?? keys[0]);
    setValue('1');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <ToolShell outputValue={result === null ? undefined : `${value} ${from} = ${format(result)} ${to}`} onReset={() => setValue('1')} shareSlug="converter-suite">
      <div className="flex flex-wrap gap-2">
        {MODES.map((item) => <Button key={item.key} size="sm" variant={mode === item.key ? 'primary' : 'outline'} onClick={() => changeMode(item.key)}>{item.label}</Button>)}
      </div>
      <label className="block text-sm font-medium">Value<input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <label className="block text-sm font-medium">From<Select className="mt-1" value={from} onChange={setFrom} options={units} /></label>
        <Button variant="outline" className="w-full sm:w-auto" onClick={swap} aria-label="Swap units"><ArrowLeftRight className="h-4 w-4" /> Swap</Button>
        <label className="block text-sm font-medium">To<Select className="mt-1" value={to} onChange={setTo} options={units} /></label>
      </div>
      <div className="rounded-xl2 border border-primary-400/30 bg-primary-50/40 p-6 text-center dark:bg-primary-500/5">
        <div className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">Converted value</div>
        <div className="mt-2 break-words font-heading text-3xl font-bold sm:text-4xl">{result === null ? '—' : format(result)}</div>
        <div className="mt-1 text-sm text-black/50 dark:text-white/50">{units.find((u) => u.value === to)?.label ?? to}</div>
      </div>
      <div className="flex items-center gap-2 text-xs text-black/45 dark:text-white/45"><RotateCcw className="h-3.5 w-3.5" /> All conversions run locally in your browser.</div>
    </ToolShell>
  );
}
