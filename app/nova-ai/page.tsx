import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { NovaAI } from '@/components/nova-ai';

export const metadata: Metadata = {
  title: 'Nova AI',
  description: 'Nova AI is the intelligent assistant inside NovaTools.',
};

export default async function NovaAIPage() {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  if (!clerkConfigured) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold">Nova AI is temporarily unavailable</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/60 dark:text-white/60">Sign-in is currently disabled while the account system is being prepared. You can continue using the regular NovaTools utilities without an account.</p>
        <Link href="/tools" className="mt-6 inline-flex rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white">Explore tools</Link>
      </main>
    );
  }
  const user = await currentUser();
  if (!user) redirect('/sign-in?redirect_url=/nova-ai');
  return <NovaAI />;
}
