import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/** Theme-aware NovaTools mark. The SVG inherits the active primary theme color. */
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('h-8 w-8 text-primary-500', className)} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(50 50)" fill="currentColor">
        <path d="M0 -4 C 14 -30, 34 -34, 44 -18 C 30 -14, 14 -8, 0 -4 Z" opacity="0.95" />
        <path d="M0 -4 C 14 -30, 34 -34, 44 -18 C 30 -14, 14 -8, 0 -4 Z" transform="rotate(120)" opacity="0.72" />
        <path d="M0 -4 C 14 -30, 34 -34, 44 -18 C 30 -14, 14 -8, 0 -4 Z" transform="rotate(240)" opacity="0.5" />
        <circle r="7" />
      </g>
    </svg>
  );
}
