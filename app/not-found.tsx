import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <Logo className="mb-6 h-16 w-16" />
      <Compass className="mb-2 h-6 w-6 text-black/30 dark:text-white/30" />
      <h1 className="font-heading text-6xl font-bold text-gradient">404</h1>
      <p className="mt-3 text-lg font-medium">This page wandered off.</p>
      <p className="mt-1 text-black/60 dark:text-white/60">The tool or page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
