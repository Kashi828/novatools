'use client';

import Link from 'next/link';
import { Menu, Search, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [{ href: '/tools', label: 'Tools' }, { href: '/categories', label: 'Categories' }, { href: '/converters', label: 'Converters' }, { href: '/pdf-tools', label: 'PDF tools' }];
  return <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-bg-light/80 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-bg-dark/80"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/" className="group flex items-center gap-2.5" aria-label="NovaTools home"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 ring-1 ring-primary-500/15 transition group-hover:scale-105 dark:text-primary-400"><Sparkles className="h-4 w-4" /></span><span className="text-lg font-bold tracking-tight">Nova<span className="text-gradient">Tools</span></span></Link><nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">{links.map((link)=><Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${pathname===link.href||pathname.startsWith(link.href+'/')?'bg-primary-500/10 text-primary-700 dark:text-primary-300':'text-black/55 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white'}`}>{link.label}</Link>)}</nav><div className="flex items-center gap-1.5"><Link href="/tools#search" aria-label="Search tools" className="hidden h-9 w-9 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/5 hover:text-black sm:flex dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"><Search className="h-4 w-4" /></Link><ThemeSwitcher /><button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)} className="flex h-9 w-9 items-center justify-center rounded-lg text-black/55 transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5 md:hidden">{open?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button></div></div>{open&&<div className="border-t border-black/[0.06] px-4 py-3 dark:border-white/[0.08] md:hidden"><nav className="grid gap-1">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">{link.label}</Link>)}</nav></div>}</header>;
}
