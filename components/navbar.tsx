'use client';

import Link from 'next/link';
import { Menu, Search, Settings2, Sparkles, X } from 'lucide-react';
import { UserButton, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';

const links = [
  { href: '/tools', label: 'Tools' },
  { href: '/categories', label: 'Categories' },
  { href: '/nova-ai', label: 'Nova AI', icon: Sparkles },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.promoEnabled === 'boolean') setPromoEnabled(data.promoEnabled);
      })
      .catch(() => undefined);
  }, []);

  const authReady = isLoaded;
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <div className="ect-top-strip">
        <div className="ect-wrap ect-top-strip__inner">
          <div className="ect-top-strip__ticker">
            <span className="ect-pulse" />
            <span>FREE ONLINE TOOLS / NO INSTALLATION REQUIRED / MOST TOOLS WORK WITHOUT AN ACCOUNT</span>
          </div>
          <div className="ect-top-strip__links">
            <Link href="/about">ABOUT</Link>
            <Link href="/feedback">FEEDBACK</Link>
            <Link href="/contact">CONTACT</Link>
          </div>
        </div>
      </div>

      <header className="ect-site-header">
        <div className="ect-wrap ect-site-header__inner">
          <Link href="/" className="ect-brand-lockup" aria-label="NovaTools home">
            <span className="ect-brand-mark"><Logo className="h-10 w-10" /></span>
            <span className="ect-brand-copy">
              <span className="ect-brand-copy__eyebrow">YOUR EVERYDAY DIGITAL WORKSPACE</span>
              <span className="ect-brand-copy__title">NovaTools</span>
              <span className="ect-brand-copy__sub">Small tools. Serious momentum.</span>
            </span>
          </Link>
          <div className="ect-header-aside" aria-label="Platform details">
            <span>60+ UTILITIES</span><i /> <span>BUILT FOR THE WEB</span>
          </div>
        </div>
      </header>

      <nav className="ect-nav-bar" aria-label="Primary navigation">
        <div className="ect-wrap ect-nav-bar__inner">
          <span className="ect-nav-index">NOVA / 001</span>
          <button type="button" className="ect-menu-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Toggle navigation">
            <span>{open ? 'CLOSE' : 'MENU'}</span>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className={`ect-nav-links ${open ? 'is-open' : ''}`}>
            <Link href="/" onClick={() => setOpen(false)} className={`ect-nav-link ${pathname === '/' ? 'is-active' : ''}`}><span className="ect-nav-number">00</span><span>Home</span></Link>
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`ect-nav-link ${active(link.href) ? 'is-active' : ''}`}>
                  <span className="ect-nav-number">{String(index + 1).padStart(2, '0')}</span>
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  <span>{link.label}</span>
                  {active(link.href) ? <span className="ect-nav-dot" /> : null}
                </Link>
              );
            })}
            <Link href="/toolkits" onClick={() => setOpen(false)} className={`ect-nav-link ${active('/toolkits') ? 'is-active' : ''}`}><span className="ect-nav-number">04</span><span>Workspaces</span></Link>
          </div>
          <div className="ect-nav-actions">
            <Link href="/tools#search" aria-label="Search tools" className="ect-nav-action"><Search className="h-4 w-4" /></Link>
            <Link href="/customize" aria-label="Customize NovaTools" className="ect-nav-action ect-nav-customize"><Settings2 className="h-4 w-4" /><span>Customize</span></Link>
            {authReady && isSignedIn ? <UserButton /> : authReady && !promoEnabled ? <Link href="/sign-in" prefetch={false} className="ect-signin">Sign in</Link> : null}
          </div>
        </div>
      </nav>
    </>
  );
}
