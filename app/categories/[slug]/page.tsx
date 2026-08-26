import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/categories';
import { getToolsByCategory } from '@/data/tools';
import { ToolCard } from '@/components/tool-card';
import { StaggerGrid, StaggerItem } from '@/components/stagger-grid';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return notFound();
  const categoryTools = getToolsByCategory(category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
          <category.icon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-heading text-3xl font-bold">{category.name}</h1>
          <p className="mt-1 text-black/60 dark:text-white/60">{category.description}</p>
        </div>
      </div>

      <StaggerGrid className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <StaggerItem key={tool.slug}><ToolCard tool={tool} /></StaggerItem>
        ))}
        {categoryTools.length === 0 && (
          <div className="col-span-full rounded-xl2 border border-dashed border-black/15 p-10 text-center text-black/50 dark:border-white/15 dark:text-white/50">
            Tools in this category are on the way.
          </div>
        )}
      </StaggerGrid>
    </div>
  );
}
