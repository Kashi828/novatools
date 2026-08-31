import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeftRight, FileText } from 'lucide-react';
import { ToolsExplorer } from '@/components/tools-explorer';

export const metadata: Metadata = {
  title: 'All Tools',
  description: 'Browse every free tool on NovaTools — text, image, PDF, developer, calculators, and more.',
};

export default function AllToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">All Tools</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">Search or filter to find exactly what you need.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/converters" className="group rounded-xl2 border border-primary-400/25 bg-primary-50/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary-400/50 dark:bg-primary-500/5">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><ArrowLeftRight className="h-5 w-5" /></span><div><h2 className="font-heading font-semibold">Converter Lab</h2><p className="text-xs text-black/50 dark:text-white/50">11 conversion categories in one workspace</p></div></div>
        </Link>
        <Link href="/pdf-tools" className="group rounded-xl2 border border-primary-400/25 bg-primary-50/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary-400/50 dark:bg-primary-500/5">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><FileText className="h-5 w-5" /></span><div><h2 className="font-heading font-semibold">PDF Toolkit</h2><p className="text-xs text-black/50 dark:text-white/50">Extract, delete, reorder, rotate, inspect, and edit metadata</p></div></div>
        </Link>
      </div>

      <Suspense fallback={null}>
        <ToolsExplorer />
      </Suspense>
    </div>
  );
}
