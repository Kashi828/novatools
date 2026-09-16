'use client';
import { Protect } from '@clerk/nextjs';
import type { ReactNode } from 'react';
interface PremiumGateProps { children: ReactNode; fallback: ReactNode; isPremium?: boolean; }
export function PremiumGate({ children, fallback, isPremium = true }: PremiumGateProps) {
  if (!isPremium) return <>{children}</>;
  return <Protect plan="premium" fallback={fallback}>{children}</Protect>;
}
