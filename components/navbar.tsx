'use client';

import Link from 'next/link';
import { Menu, Search, Settings2, Sparkles, X } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const links = [{ href: '/tools', label: 'Tools' }, { href: '/categories', label: 'Categories' }, { href: '/nova-ai', label: 'Nova AI', icon: Sparkles }];
  useEffect(() => { fetch('/api/site-settings').then((res) => res.ok ? res.json() : null).then((data) => { if (data && typeof data.promoEnabled === 'boolean') setPromoEnabled(data.promoEnabled); }).catch(() => undefined); }, []);
  const authReady = isLoaded;
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return <header className="sticky top-0 z-50 border-b border-current/10 bg-[rgb(var(--surface-page)/.82)] font-body backdrop-blur-2xl">
    <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="group flex items-center gap-2.5" aria-label="NovaTools home"><Logo className="h-9 w-9 transition-transform duration-200 group-hover:scale-105" /><span className="text-[1.05rem] font-bold tracking-tight nova-gradient-text">NovaTools</span></Link>
      <nav className="hidden items-center gap-1 rounded-xl border border-current/10 bg-[rgb(var(--surface-panel)/.55)] p-1 md:flex" aria-label="Primary navigation">{links.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${active(link.href) ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-secondary-400 hover:bg-current/5 hover:text-[rgb(var(--color-text-primary))]'}`}>{Icon ? <span className="inline-flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" />{link.label}</span> : link.label}</Link>; })}</nav>
      <div className="flex items-center gap-1.5">
        <Link href="/tools#search" aria-label="Search tools" className="nova-control hidden h-9 w-9 items-center justify-center rounded-lg sm:flex"><Search className="h-4 w-4" /></Link>
        <Link href="/customize" aria-label="Customize NovaTools" className={`nova-control hidden h-9 items-center gap-2 rounded-lg px-2.5 text-[13px] font-semibold sm:flex ${pathname === '/customize' ? 'border-primary-500/40 bg-primary-500/10 text-primary-600 dark:text-primary-400' : ''}`}><Settings2 className="h-4 w-4" /><span>Customize</span></Link>
        {authReady && isSignedIn ? <UserButton /> : authReady && !promoEnabled ? <Link href="/sign-in" prefetch={false} className="hidden rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-500/20 transition hover:bg-primary-700 sm:inline-flex">Sign in</Link> : null}
        <button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="nova-control flex h-9 w-9 items-center justify-center rounded-lg md:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
    </div>
    {open && <div className="border-t border-current/10 bg-[rgb(var(--surface-panel)/.96)] px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/30 md:hidden"><nav className="mx-auto grid max-w-7xl gap-1 font-body">{links.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${active(link.href) ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'hover:bg-current/5'}`}>{Icon && <Icon className="h-4 w-4" />}{link.label}</Link>; })}<Link href="/customize" onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${pathname === '/customize' ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'hover:bg-current/5'}`}><Settings2 className="h-4 w-4" /> Customize</Link>{authReady && isSignedIn ? <div className="flex items-center gap-3 rounded-xl px-3 py-3"><UserButton /><span className="text-sm font-semibold">Account</span></div> : authReady && !promoEnabled ? <Link href="/sign-in" prefetch={false} onClick={() => setOpen(false)} className="mt-1 rounded-xl bg-primary-600 px-3 py-3 text-center text-sm font-semibold text-white">Sign in</Link> : null}</nav></div>}
  </header>;
}
