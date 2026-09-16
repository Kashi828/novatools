import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Layers3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllToolkits, getToolkit, ToolkitHub } from '@/components/toolkit-hub';

interface Props { params: Promise<{ slug: string }>; }

export function generateStaticParams() {
  return getAllToolkits().map((toolkit) => ({ slug: toolkit.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const toolkit = getToolkit(slug);
  if (!toolkit) return {};
  return { title: toolkit.name, description: toolkit.description };
}

export default async function ToolkitPage({ params }: Props) {
  const { slug } = await params;
  const toolkit = getToolkit(slug);
  if (!toolkit) return notFound();

  const functionCount = toolkit.groups.reduce((total, group) => total + group.options.length, 0);

  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-primary-500 hover:underline"><ArrowLeft className="h-4 w-4" /> All tools</Link>
    <header className="mt-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow"><Layers3 className="h-6 w-6" /></span>
        <div><p className="nova-eyebrow">Toolkit</p><h1 className="font-heading text-3xl font-bold sm:text-4xl">{toolkit.name}</h1></div>
      </div>
      <p className="mt-4 text-base leading-7 nova-muted">{toolkit.description} Related functions are grouped together so you can find the right workflow faster.</p>
    </header>
    <div className="nova-surface-muted mt-8 rounded-3xl p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-heading text-lg font-semibold">Functions in this toolkit</h2><p className="mt-1 text-sm nova-muted">Choose from related utilities without jumping across the catalog.</p></div>
        <span className="nova-control rounded-full px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400">{functionCount} functions</span>
      </div>
      <ToolkitHub toolkit={toolkit} />
    </div>
  </div>;
}
