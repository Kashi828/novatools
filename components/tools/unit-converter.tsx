'use client';

import { useMemo, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

type CategoryKey = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'speed';

const CATEGORIES: Record<CategoryKey, { label: string; base: string; units: Record<string, number> }> = {
  length: {
    label: 'Length',
    base: 'meter',
    units: { millimeter: 0.001, centimeter: 0.01, meter: 1, kilometer: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.34 },
  },
  weight: {
    label: 'Weight',
    base: 'kilogram',
    units: { milligram: 0.000001, gram: 0.001, kilogram: 1, tonne: 1000, ounce: 0.0283495, pound: 0.453592 },
  },
  temperature: { label: 'Temperature', base: 'celsius', units: { celsius: 1, fahrenheit: 1, kelvin: 1 } },
  volume: {
    label: 'Volume',
    base: 'liter',
    units: { milliliter: 0.001, liter: 1, cubicMeter: 1000, gallon: 3.78541, quart: 0.946353, cup: 0.24 },
  },
  area: {
    label: 'Area',
    base: 'squareMeter',
    units: { squareMeter: 1, squareKilometer: 1000000, squareFoot: 0.092903, acre: 4046.86, hectare: 10000 },
  },
  speed: {
    label: 'Speed',
    base: 'metersPerSecond',
    units: { metersPerSecond: 1, kilometersPerHour: 0.277778, milesPerHour: 0.44704, knot: 0.514444 },
  },
};

function convertTemperature(value: number, from: string, to: string) {
  let celsius = value;
  if (from === 'fahrenheit') celsius = ((value - 32) * 5) / 9;
  if (from === 'kelvin') celsius = value - 273.15;

  if (to === 'fahrenheit') return (celsius * 9) / 5 + 32;
  if (to === 'kelvin') return celsius + 273.15;
  return celsius;
}

export function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>('length');
  const [from, setFrom] = useState('meter');
  const [to, setTo] = useState('foot');
  const [value, setValue] = useState('1');

  const units = Object.keys(CATEGORIES[category].units);

  function changeCategory(cat: CategoryKey) {
    setCategory(cat);
    const u = Object.keys(CATEGORIES[cat].units);
    setFrom(u[0]);
    setTo(u[1] ?? u[0]);
  }

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    if (category === 'temperature') return convertTemperature(v, from, to);
    const factors = CATEGORIES[category].units;
    return (v * factors[from]) / factors[to];
  }, [value, from, to, category]);

  return (
    <ToolShell
      outputValue={result !== null ? `${value} ${from} = ${result.toFixed(6)} ${to}` : undefined}
      onReset={() => setValue('1')}
      shareSlug="unit-converter"
    >
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
          <Button key={cat} size="sm" variant={category === cat ? 'primary' : 'outline'} onClick={() => changeCategory(cat)}>
            {CATEGORIES[cat].label}
          </Button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">From</label>
          <Select value={from} onChange={setFrom} options={units} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">To</label>
          <Select value={to} onChange={setTo} options={units} />
        </div>
      </div>

      {result !== null && (
        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 text-center dark:border-white/10 dark:bg-white/5">
          <div className="font-heading text-3xl font-bold">{result.toFixed(6).replace(/\.?0+$/, '')}</div>
          <div className="mt-1 text-sm text-black/50 dark:text-white/50">{to}</div>
        </div>
      )}
    </ToolShell>
  );
}
