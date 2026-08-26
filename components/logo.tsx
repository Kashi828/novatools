import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * A dynamic three-petal "spark" mark — three asymmetric teardrop petals sweeping
 * outward from center like a pinwheel/flame, rendered with soft organic curves
 * rather than straight geometric edges. Reads as motion and energy rather than a
 * static stamp, while staying a single clean shape at any size.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('h-8 w-8', className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="novaSpark1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--logo-grad-1, #D4BB7C)" />
          <stop offset="100%" stopColor="var(--logo-grad-2, #C9A961)" />
        </linearGradient>
        <linearGradient id="novaSpark2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--logo-grad-2, #C9A961)" />
          <stop offset="100%" stopColor="var(--logo-grad-3, #A97142)" />
        </linearGradient>
        <linearGradient id="novaSpark3" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--logo-grad-3, #A97142)" />
          <stop offset="100%" stopColor="var(--logo-grad-1, #D4BB7C)" />
        </linearGradient>
      </defs>

      <g transform="translate(50 50)">
        <path
          d="M0 -4 C 14 -30, 34 -34, 44 -18 C 30 -14, 14 -8, 0 -4 Z"
          fill="url(#novaSpark1)"
        />
        <path
          d="M0 -4 C 14 -30, 34 -34, 44 -18 C 30 -14, 14 -8, 0 -4 Z"
          fill="url(#novaSpark2)"
          transform="rotate(120)"
        />
        <path
          d="M0 -4 C 14 -30, 34 -34, 44 -18 C 30 -14, 14 -8, 0 -4 Z"
          fill="url(#novaSpark3)"
          transform="rotate(240)"
        />
        <circle r="7" fill="var(--logo-grad-2, #C9A961)" />
      </g>
    </svg>
  );
}
