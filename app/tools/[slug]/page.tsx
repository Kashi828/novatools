import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTool, tools } from '@/data/tools';
import { getCategory } from '@/data/categories';
import { Card, CardContent } from '@/components/ui/card';
import { ToolCard } from '@/components/tool-card';

import { getHiddenSlugs } from '@/lib/tool-visibility';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.name, description: tool.description, type: 'website' },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return notFound();

  const hiddenSlugs = await getHiddenSlugs();
  if (hiddenSlugs.includes(slug)) return notFound();

  const category = getCategory(tool.category);
  const ToolComponent = tool.component;
  const related = (tool.relatedSlugs ?? [])
    .map((s) => getTool(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t) && !hiddenSlugs.includes(t!.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-primary-500 dark:text-white/50">
        <ArrowLeft className="h-3.5 w-3.5" /> All tools
      </Link>

      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
          <tool.icon className="h-7 w-7" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">{tool.name}</h1>
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
              >
                {category.name}
              </Link>
            )}
          </div>
          <p className="mt-1 text-black/60 dark:text-white/60">{tool.shortDescription}</p>
        </div>
      </div>

      <Card className="mt-8">
        <CardContent>
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Clock className="h-8 w-8 text-black/30 dark:text-white/30" />
              <p className="font-medium">This tool is coming soon.</p>
              <p className="max-w-sm text-sm text-black/50 dark:text-white/50">
                We&rsquo;re building {tool.name.toLowerCase()} next. Check back shortly, or explore a live tool below.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="prose prose-sm mt-10 max-w-none text-black/70 dark:prose-invert dark:text-white/70">
        <h2 className="font-heading text-lg font-semibold">About this tool</h2>
        <p>{tool.description}</p>
      </div>

      {tool.faqs && tool.faqs.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-lg font-semibold">FAQ</h2>
          <div className="mt-4 space-y-3">
            {tool.faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <summary className="cursor-pointer list-none font-medium marker:content-none">{faq.question}</summary>
                <p className="mt-2 text-sm text-black/60 dark:text-white/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-lg font-semibold">Related tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
