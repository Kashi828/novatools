import Link from 'next/link';
import { ArrowRight, Calculator, Code2, FileText, Image as ImageIcon, Palette, Repeat, ShieldCheck, Sparkles, Type, Wrench } from 'lucide-react';
import { tools } from '@/data/tools';

const suites = [
  { href: '/converters', label: 'Converter', description: 'Units, data, fuel economy, and everyday conversions.', categories: [], meta: '11 modes', icon: Repeat },
  { href: '/pdf-tools', label: 'PDF Tools', description: 'Merge, split, compress, convert, and manage documents.', categories: ['pdf'], meta: 'PDF workspace', icon: FileText },
  { href: '/categories/image', label: 'Image Tools', description: 'Compress, resize, convert, crop, and prepare images.', categories: ['image'], meta: 'Image workspace', icon: ImageIcon },
  { href: '/categories/text', label: 'Text Tools', description: 'Count, clean, transform, compare, and format text.', categories: ['text'], meta: 'Text workspace', icon: Type },
  { href: '/categories/developer', label: 'Developer Tools', description: 'Format, encode, validate, debug, and transform data.', categories: ['developer', 'web'], meta: 'Developer workspace', icon: Code2 },
  { href: '/categories/calculators', label: 'Calculators', description: 'Math, finance, health, and everyday calculation tools.', categories: ['calculators', 'finance'], meta: 'Calculator workspace', icon: Calculator },
  { href: '/categories/security', label: 'Security Tools', description: 'Passwords, hashes, UUIDs, and privacy-friendly checks.', categories: ['security'], meta: 'Security workspace', icon: ShieldCheck },
  { href: '/categories/color', label: 'Color Tools', description: 'Pick, convert, compare, and build colors and palettes.', categories: ['color'], meta: 'Color workspace', icon: Palette },
  { href: '/categories/ai', label: 'AI Tools', description: 'Smart helpers for creating, thinking, and getting things done.', categories: ['ai'], meta: 'AI workspace', icon: Sparkles },
  { href: '/categories/utility', label: 'Utilities', description: 'Small practical tools for daily tasks and quick jobs.', categories: ['utility', 'device'], meta: 'Utility workspace', icon: Wrench },
];

export function ToolSuites({ compact = false }: { compact?: boolean }) {
  const items = compact ? suites.slice(0, 8) : suites;
  return (
    <div className={compact ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'}>
      {items.map(({ href, label, description, meta, icon: Icon, categories: categorySlugs }) => {
        const count = categorySlugs.length ? tools.filter((tool) => categorySlugs.includes(tool.category)).length : 11;
        return (
          <Link key={href} href={href} className="group rounded-2xl border border-black/[0.07] bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-1 hover:border-primary-500/25 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-black/10 dark:border-white/[0.08]">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 transition group-hover:scale-105"><Icon className="h-5 w-5" /></span>
              <ArrowRight className="mt-1 h-4 w-4 text-black/25 transition group-hover:translate-x-1 group-hover:text-primary-500 dark:text-white/25" />
            </div>
            <h3 className="mt-5 font-semibold tracking-tight">{label}</h3>
            <p className="mt-1.5 text-sm leading-5 text-black/50 dark:text-white/50">{description}</p>
            <span className="mt-4 inline-flex rounded-full border border-primary-500/15 bg-primary-500/5 px-2.5 py-1 text-[11px] font-semibold text-primary-500">{count} {meta === '11 modes' ? 'modes' : 'tools'}</span>
          </Link>
        );
      })}
    </div>
  );
}
