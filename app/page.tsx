import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Sparkles, WandSparkles, Zap } from 'lucide-react';
import { getFeaturedTools, getNewTools, getTrendingTools, tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { getHiddenSlugs } from '@/lib/tool-visibility';
import { HomeMotion } from '@/components/home/home-motion';

export const dynamic = 'force-dynamic';

const benefits = [
  { icon: Zap, title: 'Instant', text: 'Fast, focused tools with no unnecessary setup.' },
  { icon: ShieldCheck, title: 'Private by default', text: 'Most tools process your data locally in the browser.' },
  { icon: Sparkles, title: 'Free to use', text: 'Useful everyday utilities without a wall of friction.' },
];

export default async function HomePage() {
  const hidden = new Set(await getHiddenSlugs());
  const visible = (list: typeof tools) => list.filter((tool) => !hidden.has(tool.slug));
  const trending = visible(getTrendingTools()).slice(0, 8);
  const featured = visible(getFeaturedTools()).slice(0, 8);
  const fresh = visible(getNewTools()).slice(0, 4);

  return <HomeMotion>
    <section className="relative overflow-hidden border-b border-black/[0.06] dark:border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--color-primary-500)/.14),transparent_42%)]" />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/[0.07] px-3.5 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300"><WandSparkles className="h-3.5 w-3.5" />A better toolbox for the web</div>
          <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl">Everything useful,<span className="block text-gradient">in one place.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/60 dark:text-white/60 sm:text-lg">Fast, beautifully simple tools for developers, creators, students, businesses, and everyday life.</p>
          <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row"><Link href="/tools" className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:-translate-y-0.5 hover:bg-primary-700">Explore all tools <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link><Link href="/tools#search" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/70 px-5 text-sm font-semibold backdrop-blur-xl transition hover:border-primary-500/30 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.09]"><Search className="h-4 w-4" />Find a tool</Link></div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{fresh.length > 0 && <ToolSection title="New releases" tools={fresh} />}<ToolSection title="Trending tools" tools={trending} link="/tools" /><ToolSection title="Featured tools" tools={featured} /></section>
    <section className="border-y border-black/[0.06] bg-black/[0.02] dark:border-white/[0.08] dark:bg-white/[0.02]"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400">Explore</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Browse by category</h2></div><Link href="/categories" className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">View all</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{categories.map((cat) => {const count = tools.filter((tool) => tool.category === cat.slug && !hidden.has(tool.slug)).length;return <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group rounded-2xl border border-black/[0.07] bg-white/75 p-5 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-primary-500/30 hover:shadow-lg hover:shadow-black/5 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:shadow-black/20"><span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 transition group-hover:scale-105 dark:text-primary-400"><cat.icon className="h-5 w-5" /></span><span className="block text-sm font-semibold">{cat.name}</span><span className="mt-1 block text-xs text-black/45 dark:text-white/45">{count} tools</span></Link>;})}</div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-4 sm:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-black/[0.07] bg-white/65 p-6 dark:border-white/[0.08] dark:bg-white/[0.04]"><Icon className="mb-5 h-5 w-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">{text}</p></div>)}</div></section>
  </HomeMotion>;
}

function ToolSection({ title, tools: items, link }: { title: string; tools: typeof tools; link?: string }) { if (!items.length) return null; return <section className="py-8 first:pt-0"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold tracking-tight">{title}</h2>{link && <Link href={link} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}</div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-black/[0.07] bg-white/75 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl hover:shadow-black/5 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:shadow-black/20"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">{tool.icon && <tool.icon className="h-5 w-5" />}</div><h3 className="font-semibold">{tool.name}</h3><p className="mt-1.5 line-clamp-2 text-sm leading-5 text-black/50 dark:text-white/50">{tool.description}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 transition group-hover:opacity-100 dark:text-primary-400">Open <ArrowRight className="h-3 w-3" /></span></Link>)}</div></section>; }
