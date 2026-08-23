import type { ReactNode } from 'react';
import { Protect } from '@clerk/nextjs';
import { PROMO_MODE } from '@/lib/promo';

interface PremiumGateProps {
  children: ReactNode;
  fallback: ReactNode;
}

/**
 * Drop-in replacement for <Protect plan="premium">. During PROMO_MODE it renders
 * children directly for everyone, bypassing the plan check entirely — so every
 * Premium tool automatically un-gates without touching each tool's own code.
 */
export function PremiumGate({ children, fallback }: PremiumGateProps) {
  if (PROMO_MODE) return <>{children}</>;
  return (
    <Protect plan="premium" fallback={fallback}>
      {children}
    </Protect>
  );
}
