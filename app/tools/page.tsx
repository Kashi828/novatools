import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeftRight, FileText } from 'lucide-react';
import { ToolsExplorer } from '@/components/tools-explorer';
import { ToolSuites } from '@/components/tool-suites';

export const metadata: Metadata = {
  title: 'All Tools',
  description: 'Browse every free tool on NovaTools — text, image, PDF, developer, calculators, and more.',
};

export default function AllToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-500">NovaTools workspace</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">One tool. Many functions.</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">Start with a focused workspace for a whole class of tasks, or search the complete tool library below.</p>
      </div>

      <section className="mt-9">
        <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-bold tracking-tight">Tool workspaces</h2><p className="mt-1 text-sm text-black/50 dark:text-white/50">Related functions stay together instead of becoming separate tools.</p></div><Link href="/categories" className="text-sm font-semibold text-primary-500 hover:underline">Browse categories</Link></div>
        <ToolSuites />
      </section>

      <section className="mt-14" id="search">
        <div className="mb-5"><h2 className="text-2xl font-bold tracking-tight">Every individual tool</h2><p className="mt-1 text-sm text-black/50 dark:text-white/50">Search when you already know exactly what you need.</p></div>
        <Suspense fallback={null}>
          <ToolsExplorer />
        </Suspense>
      </section>
    </div>
  );
}
