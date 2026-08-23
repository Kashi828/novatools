import type { Metadata } from 'next';
import { Suspense } from 'react';
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
      <Suspense fallback={null}>
        <ToolsExplorer />
      </Suspense>
    </div>
  );
}
