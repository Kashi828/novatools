import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Hero } from '@/components/home/hero';
import { ToolCard } from '@/components/tool-card';
import { Reveal } from '@/components/reveal';
import { categories } from '@/data/categories';
import { getFeaturedTools, getNewTools, getTrendingTools, tools } from '@/data/tools';

const STATS = [
  { value: '200+', label: 'Tools & counting' },
  { value: '0', label: 'Signups required' },
  { value: '100%', label: 'Runs in your browser' },
  { value: '13', label: 'Categories covered' },
];

const REASONS = [
  { icon: Zap, title: 'Instant', description: 'Every tool loads and runs in milliseconds — no spinners, no waiting.' },
  { icon: ShieldCheck, title: 'Private by default', description: 'Most tools process everything locally in your browser. Nothing is uploaded.' },
  { icon: Sparkles, title: 'No clutter', description: 'One focused interface per tool — no ads blocking what you came to do.' },
];

const TESTIMONIALS = [
  { quote: 'I bookmark this instead of five different sites now.', name: 'Priya S.', role: 'Frontend Developer' },
  { quote: 'The EMI and GST calculators save me actual time every week.', name: 'Arjun M.', role: 'Small Business Owner' },
  { quote: 'Clean, fast, and it just works on my phone too.', name: 'Dev K.', role: 'CS Student' },
];

const FAQS = [
  { q: 'Do I need to create an account?', a: 'No — most tools on NovaTools work instantly with no signup or login required. A few bonus tools do need a free account to access, but there\u2019s never a charge to create one.' },
  { q: 'Is my data uploaded anywhere?', a: 'Most tools run entirely in your browser using JavaScript, so your input never leaves your device.' },
  { q: 'Is NovaTools really free?', a: 'Yes, every tool is free to use. Some bonus tools just require signing in first.' },
  { q: 'Can I use NovaTools on mobile?', a: 'Yes — every tool is fully responsive and works great on phones and tablets.' },
];

export default function HomePage() {
  const trending = getTrendingTools();
  const featured = getFeaturedTools();
  const newTools = getNewTools();

  return (
    <>
      <Hero />

      {newTools.length > 0 && (
        <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-success" />
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">New releases</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      </Reveal>
      )}

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">Trending tools</h2>
          <Link href="/tools" className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">Featured tools</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-heading text-2xl font-bold sm:text-3xl">Browse by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col gap-3 rounded-xl2 border border-black/5 bg-white/70 p-5 shadow-glass backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary-400/40 dark:border-white/10 dark:bg-white/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  <cat.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-semibold">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">{count} tools</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold sm:text-3xl">Why choose NovaTools</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {REASONS.map((r) => (
            <div key={r.title} className="rounded-xl2 border border-black/5 bg-white/70 p-6 text-center shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <r.icon className="h-6 w-6" />
              </span>
              <h3 className="font-heading text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{r.description}</p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="border-y border-black/5 bg-black/[0.02] py-14 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-gradient sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-black/60 dark:text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold sm:text-3xl">Loved by everyday users</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl2 border border-black/5 bg-white/70 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-black/70 dark:text-white/70">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 text-sm font-medium">{t.name}</div>
              <div className="text-xs text-black/50 dark:text-white/50">{t.role}</div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <summary className="cursor-pointer list-none font-medium marker:content-none">{f.q}</summary>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-xl2 bg-gradient-brand p-8 text-center text-white shadow-glow sm:p-12">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">Get new tools in your inbox</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Occasional emails when we ship something new. No spam, unsubscribe anytime.
          </p>
          <form className="mx-auto mt-6 flex max-w-sm gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/60"
            />
            <button type="submit" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-600">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      </Reveal>
    </>
  );
}
