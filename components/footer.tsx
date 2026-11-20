import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { categories } from '@/data/categories';
import { isAdminUser } from '@/lib/admin';

export async function Footer() {
  const isAdmin = await isAdminUser();
  return (
    <footer className="ect-site-footer">
      <div className="ect-wrap ect-footer-grid">
        <div>
          <div className="ect-footer-code">NOVA / DIGITAL WORKSPACE / 2026</div>
          <Link href="/" className="ect-footer-brand"><Logo className="h-9 w-9" /><span>NovaTools</span></Link>
          <h2 className="ect-footer-title">Make the next<br /><em>thing easier.</em></h2>
          <p className="ect-footer-copy">Free online tools that save you time. No installation needed — most tools require no account at all.</p>
        </div>
        <div className="ect-footer-column">
          <span className="ect-footer-label">EXPLORE</span>
          {categories.slice(0, 6).map((category) => <Link key={category.slug} href={`/categories/${category.slug}`}>{category.name}<ArrowUpRight className="h-3 w-3" /></Link>)}
        </div>
        <div className="ect-footer-column">
          <span className="ect-footer-label">PLATFORM</span>
          <Link href="/tools">All tools<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/toolkits">Workspaces<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/nova-ai">Nova AI<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/about">About<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/feedback">Feedback<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/contact">Contact<ArrowUpRight className="h-3 w-3" /></Link>
          {isAdmin && <Link href="/admin">Admin<ArrowUpRight className="h-3 w-3" /></Link>}
        </div>
        <div className="ect-footer-column">
          <span className="ect-footer-label">INFORMATION</span>
          <Link href="/pricing">Pricing<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/privacy">Privacy policy<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/terms">Terms of service<ArrowUpRight className="h-3 w-3" /></Link>
          <Link href="/customize">Appearance settings<ArrowUpRight className="h-3 w-3" /></Link>
        </div>
      </div>
      <div className="ect-wrap ect-footer-bottom">
        <span>© {new Date().getFullYear()} NovaTools. All rights reserved.</span>
        <span>OPEN → CREATE → COMPLETE</span>
        <span>BUILT FOR SPEED. DESIGNED FOR CLARITY.</span>
      </div>
    </footer>
  );
}
