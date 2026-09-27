import type { Metadata } from 'next';
import { PricingTable } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Free tools for everyone, with an optional Premium plan for power users.',
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Simple, honest pricing</h1>
        <p className="mx-auto mt-3 max-w-xl text-black/60 dark:text-white/60">
          Every core tool works free, forever, with no signup required. A free account unlocks a handful of bonus tools and removes a few limits — there&apos;s no charge for it.
        </p>
      </div>

      <div className="mt-10">
        <PricingTable />
      </div>
    </div>
  );
}
