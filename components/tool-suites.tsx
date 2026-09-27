import Link from 'next/link';
import { ArrowRight, Calculator, Code2, FileText, Image as ImageIcon, Palette, Repeat, ShieldCheck, Type, Wrench, Monitor, BrainCircuit, GraduationCap, Wallet } from 'lucide-react';

const suites = [
  { href: '/toolkits/pdf', label: 'PDF Toolkit', description: 'Edit, organize, merge, split, compress, and convert PDFs.', meta: '6 functions', icon: FileText },
  { href: '/toolkits/image', label: 'Image Toolkit', description: 'Compress, resize, convert, batch-process, and prepare images.', meta: '6 functions', icon: ImageIcon },
  { href: '/toolkits/text', label: 'Text Toolkit', description: 'Clean, transform, count, compare, and analyze text.', meta: '9 functions', icon: Type },
  { href: '/toolkits/developer', label: 'Developer Toolkit', description: 'JSON, CSV, URLs, regex, markup, SQL, and encoding.', meta: '17 functions', icon: Code2 },
  { href: '/toolkits/calculators', label: 'Calculator Toolkit', description: 'Math, dates, percentages, ratios, speed, and everyday calculations.', meta: '15 functions', icon: Calculator },
  { href: '/toolkits/converters', label: 'Converter Toolkit', description: 'Units, currency, time zones, file sizes, bases, binary, and encoding.', meta: '11 functions', icon: Repeat },
  { href: '/toolkits/student', label: 'Student Toolkit', description: 'Grades, exams, study planning, flashcards, and citations.', meta: '10 functions', icon: GraduationCap },
  { href: '/toolkits/finance', label: 'Finance Toolkit', description: 'Loans, taxes, budgets, pricing, profit, interest, and savings.', meta: '13 functions', icon: Wallet },
  { href: '/toolkits/web', label: 'Web Toolkit', description: 'QR, SEO, metadata, UTM, sitemap, robots, slugs, and favicons.', meta: '11 functions', icon: Palette },
  { href: '/toolkits/security', label: 'Security Toolkit', description: 'Passwords, passphrases, hashing, UUIDs, and validation.', meta: '7 functions', icon: ShieldCheck },
  { href: '/toolkits/color', label: 'Color Toolkit', description: 'Pick, convert, compare, simulate, and build colors.', meta: '9 functions', icon: Palette },
  { href: '/toolkits/utility', label: 'Utility Toolkit', description: 'Everyday generators, randomizers, lists, and helpers.', meta: '13 functions', icon: Wrench },
  { href: '/toolkits/device', label: 'Device Toolkit', description: 'Device, screen, clock, and network utilities.', meta: '4 functions', icon: Monitor },
  { href: '/toolkits/ai', label: 'Nova AI Toolkit', description: 'Writing, translation, study, content, and developer assistants.', meta: '17 functions', icon: BrainCircuit },
];

export function ToolSuites({ compact = false }: { compact?: boolean }) {
  const items = compact ? suites.slice(0, 8) : suites;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {items.map(({ href, label, description, meta, icon: Icon }) => <Link key={href} href={href} className="nova-surface group rounded-2xl p-5 transition duration-200 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 transition group-hover:scale-105"><Icon className="h-5 w-5" /></span><ArrowRight className="mt-1 h-4 w-4 nova-muted transition group-hover:translate-x-1 group-hover:text-primary-500" /></div>
      <h3 className="mt-5 font-semibold tracking-tight">{label}</h3>
      <p className="mt-1.5 text-sm leading-5 nova-muted">{description}</p>
      <span className="mt-4 inline-flex rounded-full border border-primary-500/15 bg-primary-500/5 px-2.5 py-1 text-[11px] font-semibold text-primary-500">{meta}</span>
    </Link>)}
  </div>;
}
