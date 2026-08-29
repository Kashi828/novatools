import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, MessageSquare, Wrench, UsersRound } from 'lucide-react';
import { isAdminUser } from '@/lib/admin';
import { listComments } from '@/lib/comments';
import { tools } from '@/data/tools';
import { getSiteSettings } from '@/lib/site-settings';
import { AdminCommentsPanel } from '@/components/admin-comments-panel';
import { AdminToolsPanel } from '@/components/admin-tools-panel';
import { AdminPromoPanel } from '@/components/admin-promo-panel';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await isAdminUser();

  if (!admin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-32 text-center">
        <ShieldAlert className="h-10 w-10 text-black/30 dark:text-white/30" />
        <h1 className="font-heading text-2xl font-semibold">Not authorized</h1>
        <p className="text-sm text-black/50 dark:text-white/50">This page is only visible to the site admin. If that&apos;s you, sign in with your admin account first.</p>
        <Link href="/" className="mt-2 text-sm text-primary-500 hover:underline">Back to home</Link>
      </div>
    );
  }

  const [comments, settings] = await Promise.all([listComments(), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="inline-flex rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400">NovaTools control room</span>
      <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Admin</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">Manage what visitors see, moderate feedback, and keep the catalogue tidy—without editing code for routine work.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5"><div className="font-heading text-3xl font-bold">{tools.length}</div><div className="text-sm text-black/50 dark:text-white/50">Registered tools</div></div>
        <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5"><div className="font-heading text-3xl font-bold">{comments.length}</div><div className="text-sm text-black/50 dark:text-white/50">Comments posted</div></div>
        <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5"><div className={`font-heading text-lg font-bold ${settings.promoEnabled ? 'text-success' : 'text-black/60 dark:text-white/60'}`}>{settings.promoEnabled ? 'ON' : 'OFF'}</div><div className="text-sm text-black/50 dark:text-white/50">Promo mode</div></div>
      </div>

      <div className="mt-10"><AdminPromoPanel /></div>

      <div className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold"><Wrench className="h-4 w-4" /> Tool catalogue</h2>
        <p className="mb-4 text-sm text-black/60 dark:text-white/60">Hide a tool during maintenance or show it again when it is ready. Hidden tools disappear from public discovery, search, and category listings.</p>
        <AdminToolsPanel />
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><MessageSquare className="h-4 w-4" /> Comment moderation</h2><Link href="/feedback" className="text-sm text-primary-500 hover:underline">View public page</Link></div>
        <AdminCommentsPanel />
      </div>

      <div className="mt-10 rounded-xl2 border border-primary-400/30 bg-primary-50/50 p-5 dark:bg-primary-500/5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><UsersRound className="h-4 w-4 text-primary-500" /> Members and subscriptions</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">The site now owns day-to-day promotion and catalogue controls. Subscription billing still uses Clerk&apos;s secure payment infrastructure; the next upgrade should add an in-app member directory and plan actions through Clerk&apos;s server API, so private billing credentials never reach the browser.</p>
      </div>
    </div>
  );
}
