import Link from 'next/link';
import { ArrowRight, Calculator, Code2, FileText, Image as ImageIcon, Palette, Repeat, ShieldCheck, Type } from 'lucide-react';

const suites = [
  { href: '/toolkits/converters', label: 'Converter Toolkit', description: 'Units, currency, time zones, file sizes, and data conversions in one workspace.', meta: '10+ functions', icon: Repeat },
  { href: '/toolkits/pdf', label: 'PDF Toolkit', description: 'Merge, split, compress, convert, reorder, rotate, and inspect PDFs.', meta: '6+ functions', icon: FileText },
  { href: '/toolkits/image', label: 'Image Toolkit', description: 'Compress, convert, resize, batch-process, and prepare images.', meta: '6+ functions', icon: ImageIcon },
  { href: '/toolkits/text', label: 'Text Toolkit', description: 'Count, clean, sort, compare, transform, and inspect text.', meta: '7+ functions', icon: Type },
  { href: '/toolkits/developer', label: 'Developer Toolkit', description: 'JSON, URLs, regex, markup, Markdown, CSV, and developer utilities.', meta: '12+ functions', icon: Code2 },
  { href: '/toolkits/calculators', label: 'Calculator Toolkit', description: 'Math, date, percentage, scientific, and everyday calculators.', meta: '10+ functions', icon: Calculator },
  { href: '/toolkits/security', label: 'Security Toolkit', description: 'Passwords, passphrases, hashes, UUIDs, Base64, and hex tools.', meta: '8+ functions', icon: ShieldCheck },
  { href: '/toolkits/web', label: 'Web Toolkit', description: 'QR, SEO, UTM, metadata, sitemap, slug, and favicon helpers.', meta: '11+ functions', icon: Palette },
];

export function ToolSuites({ compact = false }: { compact?: boolean }) {
  const items = compact ? suites.slice(0, 6) : suites;
  return (
    <div className={compact ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'}>
      {items.map(({ href, label, description, meta, icon: Icon }) => (
        <Link key={href} href={href} className="group rounded-2xl border border-black/[0.07] bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-1 hover:border-primary-500/25 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-black/10 dark:border-white/[0.08]">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 transition group-hover:scale-105"><Icon className="h-5 w-5" /></span>
            <ArrowRight className="mt-1 h-4 w-4 text-black/25 transition group-hover:translate-x-1 group-hover:text-primary-500 dark:text-white/25" />
          </div>
          <h3 className="mt-5 font-semibold tracking-tight">{label}</h3>
          <p className="mt-1.5 text-sm leading-5 text-black/50 dark:text-white/50">{description}</p>
          <span className="mt-4 inline-flex rounded-full border border-primary-500/15 bg-primary-500/5 px-2.5 py-1 text-[11px] font-semibold text-primary-500">{meta}</span>
        </Link>
      ))}
    </div>
  );
}
