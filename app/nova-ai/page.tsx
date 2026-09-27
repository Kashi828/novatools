import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NovaAI } from '@/components/nova-ai';

export const metadata: Metadata = {
  title: 'Nova AI',
  description: 'Nova AI is the intelligent assistant inside NovaTools.',
};

export default async function NovaAIPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in?redirect_url=/nova-ai');
  return <NovaAI />;
}
