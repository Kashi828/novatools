import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, MessageSquare, Wrench, ExternalLink } from 'lucide-react';
import { isAdminUser } from '@/lib/admin';
import { listComments } from '@/lib/comments';
import { tools } from '@/data/tools';
import { PROMO_MODE } from '@/lib/promo';
import { AdminCommentsPanel } from '@/components/admin-comments-panel';
import { AdminToolsPanel } from '@/components/admin-tools-panel';

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
        <p className="text-sm text-black/50 dark:text-white/50">
          This page is only visible to the site admin. If that&rsquo;s you, sign in with your admin account first.
        </p>
        <Link href="/" className="mt-2 text-sm text-primary-500 hover:underline">Back to home</Link>
      </div>
    );
  }

  const comments = await listComments();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Admin</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">Site overview and moderation tools — visible only to you.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
          <div className="font-heading text-3xl font-bold">{tools.length}</div>
          <div className="text-sm text-black/50 dark:text-white/50">Total tools</div>
        </div>
        <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
          <div className="font-heading text-3xl font-bold">{comments.length}</div>
          <div className="text-sm text-black/50 dark:text-white/50">Comments posted</div>
        </div>
        <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
          <div className={`font-heading text-lg font-bold ${PROMO_MODE ? 'text-success' : 'text-black/60 dark:text-white/60'}`}>
            {PROMO_MODE ? 'ON' : 'OFF'}
          </div>
          <div className="text-sm text-black/50 dark:text-white/50">Promo mode (edit lib/promo.ts to change)</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
          <Wrench className="h-4 w-4" /> Manage tools — click to hide/show from the public site
        </h2>
        <AdminToolsPanel />
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <MessageSquare className="h-4 w-4" /> Comment moderation
          </h2>
          <Link href="/feedback" className="text-sm text-primary-500 hover:underline">View public page</Link>
        </div>
        <AdminCommentsPanel />
      </div>

      <div className="mt-10 rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-2 font-heading text-lg font-semibold">User & billing management</h2>
        <p className="text-sm text-black/60 dark:text-white/60">
          Managing signed-up users, subscriptions, and payments happens in your Clerk dashboard, not here.
        </p>
        <a
          href="https://dashboard.clerk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:underline"
        >
          Open Clerk dashboard <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
