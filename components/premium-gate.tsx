'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Protect } from '@clerk/nextjs';

interface PremiumGateProps {
  children: ReactNode;
  fallback: ReactNode;
}

/**
 * Uses the admin-controlled promo setting at runtime. If settings cannot load,
 * the normal Clerk plan check remains in place so premium features stay protected.
 */
export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const [promoEnabled, setPromoEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setPromoEnabled(data?.promoEnabled === true))
      .catch(() => undefined);
  }, []);

  if (promoEnabled) return <>{children}</>;

  return <Protect plan="premium" fallback={fallback}>{children}</Protect>;
}
