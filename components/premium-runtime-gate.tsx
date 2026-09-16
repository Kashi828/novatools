'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Protect } from '@clerk/nextjs';
import { Crown, LockKeyhole } from 'lucide-react';

export function PremiumRuntimeGate({
  slug,
  defaultPremium,
  children,
}: {
  slug: string;
  defaultPremium: boolean;
  children: ReactNode;
}) {
  const [premium, setPremium] = useState(defaultPremium);

  useEffect(() => {
    let active = true;
    fetch('/api/tool-premium', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { premiumTools?: string[] } | null) => {
        if (active && Array.isArray(payload?.premiumTools)) {
          setPremium(payload.premiumTools.includes(slug));
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [slug]);

  if (!premium) return <>{children}</>;

  return (
    <Protect
      plan="premium"
      fallback={
        <div className="rounded-2xl border border-primary-400/20 bg-primary-500/5 p-7 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-premium text-white shadow-glow-gold">
            <Crown className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-heading text-xl font-semibold">Premium tool</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-black/55 dark:text-white/55">
            This tool is currently reserved for NovaTools Premium members.
          </p>
          <a
            href="/pricing"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            <LockKeyhole className="h-4 w-4" /> View Premium
          </a>
        </div>
      }
    >
      {children}
    </Protect>
  );
}
