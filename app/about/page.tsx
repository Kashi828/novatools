import type { Metadata } from 'next';
import { Zap, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'NovaTools is a fast, private-first toolkit for everyday work.',
};

const principles = [
  { icon: Zap, title: 'Fast by design', desc: 'Tools should respond immediately. We keep workflows focused and avoid making you wait for a simple job.' },
  { icon: ShieldCheck, title: 'Private by default', desc: 'Where possible, work happens in your browser. Files and text are not silently stored just because you used a tool.' },
  { icon: Heart, title: 'Useful for everyone', desc: 'Core tools are available without ads blocking the work or compulsory sign-up walls.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400"><Sparkles className="h-3.5 w-3.5" /> Built for everyday momentum</span>
      <h1 className="mt-4 font-heading text-3xl font-bold sm:text-5xl">One calm place for the tools you reach for every day.</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-black/70 dark:text-white/70">
        <p>NovaTools began with a familiar frustration: needing a quick converter, generator, formatter, or calculator and having to push through cluttered, ad-heavy pages before finding one that simply works.</p>
        <p>We are building the opposite: a growing, well-made collection of tools that open quickly, explain themselves clearly, and respect your time. Most run locally on your device, so your input stays with you.</p>
        <p>NovaTools is independently built by Kashinath. The product evolves from real requests—if a workflow feels awkward or a tool is missing, we want to hear about it.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {principles.map((principle) => <div key={principle.title} className="rounded-xl2 border border-black/5 bg-white/70 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5"><principle.icon className="mb-4 h-7 w-7 text-primary-500" /><h2 className="font-heading text-lg font-semibold">{principle.title}</h2><p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{principle.desc}</p></div>)}
      </div>
    </div>
  );
}
