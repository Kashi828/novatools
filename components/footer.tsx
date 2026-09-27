import Link from 'next/link';
import { Logo } from '@/components/logo';
import { categories } from '@/data/categories';
import { isAdminUser } from '@/lib/admin';

export async function Footer() {
  const isAdmin = await isAdminUser();
  return (
    <footer className="border-t border-black/5 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
              <Logo />
              NovaTools
            </Link>
            <p className="mt-3 max-w-xs text-sm text-black/60 dark:text-white/60">
              Free online tools that save you time. No installation needed — most tools require no account at all.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="hover:text-primary-500">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
              <li><Link href="/about" className="hover:text-primary-500">About</Link></li>
              <li><Link href="/feedback" className="hover:text-primary-500">Feedback</Link></li>
              <li><Link href="/contact" className="hover:text-primary-500">Contact</Link></li>
              <li><Link href="/tools" className="hover:text-primary-500">All Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-black/60 dark:text-white/60">
              <li><Link href="/privacy" className="hover:text-primary-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500">Terms of Service</Link></li>
              {isAdmin && (
                <li><Link href="/admin" className="hover:text-primary-500">Admin</Link></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-6 text-xs text-black/50 dark:border-white/10 dark:text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} NovaTools. All rights reserved.</p>
          <p>Built for speed. Runs entirely in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
