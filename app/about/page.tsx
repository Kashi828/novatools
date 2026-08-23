import type { Metadata } from 'next';
import { Zap, ShieldCheck, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why NovaTools exists and what we believe about free software.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">About NovaTools</h1>
      <p className="mt-4 text-black/70 dark:text-white/70">
        NovaTools started from a simple frustration: needing a quick tool — a password generator, a unit converter, a JSON
        formatter — and having to wade through five ad-heavy sites before finding one that just worked. We&rsquo;re building
        the opposite: a fast, clean, single place for the everyday tools people reach for constantly.
      </p>
      <p className="mt-4 text-black/70 dark:text-white/70">
        Every core tool is free, requires no account, and where possible runs entirely in your browser — your input never touches
        a server.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { icon: Zap, title: 'Fast', desc: 'No bloat, no wait — tools open and respond instantly.' },
          { icon: ShieldCheck, title: 'Private', desc: 'Most processing happens locally on your device.' },
          { icon: Heart, title: 'Free', desc: 'No paywalls, no forced signups, ever.' },
        ].map((v) => (
          <div key={v.title} className="rounded-xl2 border border-black/5 bg-white/70 p-6 text-center shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <v.icon className="mx-auto mb-3 h-7 w-7 text-primary-500" />
            <h3 className="font-heading font-semibold">{v.title}</h3>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
