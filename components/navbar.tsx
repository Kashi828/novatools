'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Search, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/logo';
import { ThemePicker } from '@/components/theme-picker';
import { useTheme } from '@/components/theme-provider';
import { PROMO_MODE } from '@/lib/promo';

const BASE_NAV_LINKS = [
  { href: '/tools', label: 'All Tools' },
  { href: '/categories', label: 'Categories' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const NAV_LINKS = PROMO_MODE ? BASE_NAV_LINKS.filter((l) => l.href !== '/pricing') : BASE_NAV_LINKS;

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/5 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-bg-dark/70'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <Logo />
          NovaTools
        </Link>

        <div className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHoveredLink(null)}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
            >
              {hoveredLink === link.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 rounded-lg bg-black/5 dark:bg-white/10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="hidden items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-black/50 transition-colors hover:border-primary-400/50 dark:border-white/10 dark:text-white/50 sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            Search
            <kbd className="rounded border border-black/10 bg-black/5 px-1.5 py-0.5 text-[10px] dark:border-white/10 dark:bg-white/10">
              Ctrl K
            </kbd>
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition-colors hover:border-primary-400/50 dark:border-white/10"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <ThemePicker />

          {!PROMO_MODE && (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hidden rounded-lg bg-gradient-brand px-3.5 py-1.5 text-sm font-medium text-white shadow-glow sm:block">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-bg-dark/95 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
