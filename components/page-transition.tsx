import type { ReactNode } from 'react';

/** Lightweight route wrapper. CSS handles the visual transition without shipping
 * an animation runtime to every page in the application shell. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="route-content">{children}</div>;
}
