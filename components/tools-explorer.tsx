'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { ToolCard } from '@/components/tool-card';
import { StaggerGrid, StaggerItem } from '@/components/stagger-grid';
import { categories } from '@/data/categories';
import { searchTools } from '@/data/tools';
import '@/data/ai-tools';
import type { CategorySlug } from '@/data/types';
import { useHiddenTools } from '@/lib/use-hidden-tools';

export function ToolsExplorer() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const hiddenSlugs = useHiddenTools();

  const results = useMemo(() => {
    const base = searchTools(query).filter((t) => !hiddenSlugs.has(t.slug));
    return activeCategory === 'all' ? base : base.filter((t) => t.category === activeCategory);
  }, [query, activeCategory, hiddenSlugs]);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 p-2 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <Search className="ml-2 h-5 w-5 shrink-0 text-black/40 dark:text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-gradient-brand text-white shadow-glow'
              : 'border border-black/10 text-black/60 hover:border-primary-400/50 dark:border-white/10 dark:text-white/60'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCategory(c.slug)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === c.slug
                ? 'bg-gradient-brand text-white shadow-glow'
                : 'border border-black/10 text-black/60 hover:border-primary-400/50 dark:border-white/10 dark:text-white/60'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-black/50 dark:text-white/50">{results.length} tools</p>
      <StaggerGrid className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((tool) => (
          <StaggerItem key={tool.slug}><ToolCard tool={tool} /></StaggerItem>
        ))}
        {results.length === 0 && (
          <div className="col-span-full rounded-xl2 border border-dashed border-black/15 p-10 text-center text-black/50 dark:border-white/15 dark:text-white/50">
            No tools match &ldquo;{query}&rdquo;. Try a different search.
          </div>
        )}
      </StaggerGrid>
    </div>
  );
}
