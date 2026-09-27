import type { ReactNode } from 'react';

/**
 * Tool grids deliberately render as normal DOM elements.
 * The previous viewport/opacity animation could leave cards invisible when
 * Framer Motion did not complete its initial variant transition.
 */
export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
