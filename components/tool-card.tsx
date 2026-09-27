import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ToolDefinition } from '@/data/types';
import { getCategory } from '@/data/categories';
import { CardHoverWrapper, IconHoverWrapper } from '@/components/tool-card-motion';
import { PremiumBadge } from '@/components/premium-badge';

const FREE_PREMIUM_SLUGS = new Set(['batch-image-processor', 'qr-batch-generator']);

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const category = getCategory(tool.category);
  const isStaticallyPremium = Boolean(tool.premium) && !FREE_PREMIUM_SLUGS.has(tool.slug);
  const badge = tool.component
    ? tool.isNew && !isStaticallyPremium
      ? { label: 'New', className: 'bg-success/15 text-success' }
      : null
    : { label: 'Soon', className: 'bg-warning/15 text-warning' };

  return (
    <CardHoverWrapper>
      <Link href={`/tools/${tool.slug}`} className="shine-sweep relative flex h-full flex-col gap-3 rounded-xl2 border border-black/5 bg-white/70 p-5 shadow-glass backdrop-blur-xl transition-colors duration-300 group-hover:border-primary-400/40 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start justify-between gap-3">
          <IconHoverWrapper><tool.icon className="h-5 w-5" /></IconHoverWrapper>
          <div className="flex items-center gap-2">
            <PremiumBadge slug={tool.slug} defaultPremium={isStaticallyPremium} />
            {badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.className}`}>{badge.label}</span>}
            <ArrowUpRight className="h-4 w-4 text-black/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-500 dark:text-white/20" />
          </div>
        </div>
        <div><h3 className="font-heading text-base font-semibold">{tool.name}</h3><p className="mt-1 text-sm text-black/60 dark:text-white/60">{tool.shortDescription}</p></div>
        {category && <span className="mt-auto w-fit rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">{category.name}</span>}
      </Link>
    </CardHoverWrapper>
  );
}
