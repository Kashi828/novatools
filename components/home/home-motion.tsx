'use client';

import type { ReactNode } from 'react';

/** CSS route/reveal wrapper; reduced-motion preferences are handled globally. */
export function HomeMotion({ children }: { children: ReactNode }) {
  return <div className="nova-home-motion">{children}</div>;
}
