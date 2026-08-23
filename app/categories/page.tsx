import type { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { tools } from '@/data/tools';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Explore all tool categories on NovaTools.',
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Categories</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">Every tool, organized by what it helps you do.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = tools.filter((t) => t.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex items-start gap-4 rounded-xl2 border border-black/5 bg-white/70 p-6 shadow-glass backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary-400/40 dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <cat.icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-semibold">{cat.name}</h2>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">{cat.description}</p>
                <p className="mt-2 text-xs font-medium text-primary-500">{count} tools</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
