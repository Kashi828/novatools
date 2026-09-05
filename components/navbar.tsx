'use client';

import Link from 'next/link';
import { Menu, Search, Settings2, X } from 'lucide-react';
import { Show, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const pathname = usePathname();
  const links = [{ href: '/tools', label: 'Tools' }, { href: '/categories', label: 'Categories' }, { href: '/converters', label: 'Converters' }, { href: '/pdf-tools', label: 'PDF tools' }];
  useEffect(() => { fetch('/api/site-settings').then((res) => res.ok ? res.json() : null).then((data) => { if (data && typeof data.promoEnabled === 'boolean') setPromoEnabled(data.promoEnabled); }).catch(() => undefined); }, []);
  return <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-bg-light/90 font-body backdrop-blur-xl dark:border-white/[0.08] dark:bg-bg-dark/90"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <Link href="/" className="group flex items-center gap-2.5" aria-label="NovaTools home"><Logo className="h-9 w-9 transition-transform duration-200 group-hover:scale-105" /><span className="text-lg font-bold tracking-tight text-secondary-400">NovaTools</span></Link>
    <nav className="hidden items-center gap-1 font-body md:flex" aria-label="Primary navigation">{links.map((link) => <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${pathname === link.href || pathname.startsWith(link.href + '/') ? 'bg-secondary-500/10 text-secondary-300' : 'text-black/55 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white'}`}>{link.label}</Link>)}</nav>
    <div className="flex items-center gap-1.5 font-body"><Link href="/tools#search" aria-label="Search tools" className="hidden h-9 w-9 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/5 hover:text-black sm:flex dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"><Search className="h-4 w-4" /></Link><Link href="/customize" aria-label="Customize NovaTools" className={`hidden h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium transition sm:flex ${pathname === '/customize' ? 'bg-secondary-500/10 text-secondary-300' : 'text-black/55 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white'}`}><Settings2 className="h-4 w-4" /><span>Customize</span></Link><Show when="signed-in"><UserButton /></Show><Show when="signed-out">{!promoEnabled && <Link href="/sign-in" prefetch={false} className="hidden rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 sm:inline-flex">Sign in</Link>}</Show><button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5 md:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
  </div>{open && <div className="border-t border-black/[0.06] px-4 py-3 dark:border-white/[0.08] md:hidden"><nav className="grid gap-1 font-body">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">{link.label}</Link>)}<Link href="/customize" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"><Settings2 className="h-4 w-4" /> Customize</Link><Show when="signed-out">{!promoEnabled && <Link href="/sign-in" prefetch={false} onClick={() => setOpen(false)} className="mt-1 rounded-xl bg-primary-600 px-3 py-3 text-center text-sm font-semibold text-white">Sign in</Link>}</Show></nav></div>}</header>;
}
