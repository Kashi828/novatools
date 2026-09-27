import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftRight, Calculator } from 'lucide-react';
import { ConverterSuite } from '@/components/converter-suite';

export const metadata: Metadata = {
  title: 'Converter Lab',
  description: 'Convert length, weight, temperature, volume, area, speed, pressure, energy, power, data, and fuel economy in one place.',
};

export default function ConvertersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/tools" className="text-sm text-primary-500 hover:underline">← Back to all tools</Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><ArrowLeftRight className="h-5 w-5" /></span>
          <div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">Converter Lab</h1>
            <p className="mt-1 text-black/60 dark:text-white/60">A larger conversion workspace for everyday, technical, and developer needs.</p>
          </div>
        </div>
      </div>
      <ConverterSuite />
      <div className="mt-10 rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start gap-3">
          <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
          <div><h2 className="font-heading font-semibold">More converter ideas</h2><p className="mt-1 text-sm text-black/60 dark:text-white/60">NovaTools already includes dedicated Unit, Currency, Timezone, and File Size converters. This lab adds broader engineering and everyday conversion categories without replacing them.</p></div>
        </div>
      </div>
    </div>
  );
}
