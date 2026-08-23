import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ToolDefinition } from '@/data/types';
import { getCategory } from '@/data/categories';
import { CardHoverWrapper, IconHoverWrapper } from '@/components/tool-card-motion';

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const category = getCategory(tool.category);
  return (
    <CardHoverWrapper>
      <div className="absolute -inset-px rounded-xl2 bg-gradient-brand opacity-0 blur transition-opacity duration-300 group-hover:opacity-40" />

      <Link
        href={`/tools/${tool.slug}`}
        className="shine-sweep relative flex h-full flex-col gap-3 rounded-xl2 border border-black/5 bg-white/70 p-5 shadow-glass backdrop-blur-xl transition-colors duration-300 group-hover:border-primary-400/40 dark:border-white/10 dark:bg-white/5"
      >
        <div className="flex items-start justify-between">
          <IconHoverWrapper>
            <tool.icon className="h-5 w-5" />
          </IconHoverWrapper>
          <ArrowUpRight className="h-4 w-4 text-black/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-500 dark:text-white/20" />
        </div>
        <div>
          <h3 className="font-heading text-base font-semibold">{tool.name}</h3>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">{tool.shortDescription}</p>
        </div>
        {category && (
          <span className="mt-auto w-fit rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
            {category.name}
          </span>
        )}
        {!tool.component && (
          <span className="absolute right-3 top-3 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
            Soon
          </span>
        )}
        {tool.isNew && tool.component && (
          <span className="absolute right-3 top-3 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
            New
          </span>
        )}
        {tool.premium && tool.component && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-premium px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-glow-gold">
            Premium
          </span>
        )}
      </Link>
    </CardHoverWrapper>
  );
}
