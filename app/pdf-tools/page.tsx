import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Sparkles } from 'lucide-react';
import { PdfSuite } from '@/components/pdf-suite';

export const metadata: Metadata = {
  title: 'PDF Toolkit',
  description: 'Edit, extract, delete, reorder, rotate, inspect, and update PDF documents in your browser.',
};

export default function PdfToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/tools" className="text-sm text-primary-500 hover:underline">← Back to all tools</Link>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500"><FileText className="h-5 w-5" /></span>
          <div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">PDF Toolkit</h1>
            <p className="mt-1 text-black/60 dark:text-white/60">A practical PDF workspace for page management and document metadata.</p>
          </div>
        </div>
      </div>
      <PdfSuite />
      <div className="mt-10 flex items-start gap-3 rounded-xl2 border border-primary-400/30 bg-primary-50/30 p-5 dark:bg-primary-500/5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
        <p className="text-sm text-black/60 dark:text-white/60"><span className="font-medium text-black dark:text-white">Existing PDF tools stay available.</span> NovaTools still has dedicated PDF Merge, Split, Compress, PDF to Image, and Image to PDF tools alongside this toolkit.</p>
      </div>
    </div>
  );
}
