import type { Metadata } from 'next';
import { NovaAI } from '@/components/nova-ai';

export const metadata: Metadata = {
  title: 'Nova AI',
  description: 'Nova AI is the intelligent assistant inside NovaTools.',
};

export default function NovaAIPage() {
  return <NovaAI />;
}
