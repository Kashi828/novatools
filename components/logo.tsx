import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * A seal/emblem mark: an octagonal badge frame, a four-pointed "nova" star at the
 * center, and small laurel-leaf flourishes beneath — the visual language of a quality
 * seal rather than a tech app icon or a single letterform.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('h-8 w-8', className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="novaSealGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--logo-grad-1, #D4BB7C)" />
          <stop offset="50%" stopColor="var(--logo-grad-2, #C9A961)" />
          <stop offset="100%" stopColor="var(--logo-grad-3, #A97142)" />
        </linearGradient>
      </defs>

      {/* Octagonal badge frame */}
      <path
        d="M32 6 H68 L94 32 V68 L68 94 H32 L6 68 V32 Z"
        fill="none"
        stroke="url(#novaSealGold)"
        strokeWidth="2.5"
      />
      <path
        d="M32 6 H68 L94 32 V68 L68 94 H32 L6 68 V32 Z"
        fill="none"
        stroke="url(#novaSealGold)"
        strokeWidth="0.75"
        transform="translate(50 50) scale(0.88) translate(-50 -50)"
      />

      {/* Four-pointed nova star, center */}
      <path
        d="M50 26 C51 38 54 44 50 50 C54 56 51 62 50 74 C49 62 46 56 50 50 C46 44 49 38 50 26 Z
           M26 50 C38 49 44 46 50 50 C56 46 62 49 74 50 C62 51 56 54 50 50 C44 54 38 51 26 50 Z"
        fill="url(#novaSealGold)"
      />

      {/* Laurel flourishes */}
      <g stroke="url(#novaSealGold)" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M40 82 C34 80 30 76 29 71" />
        <ellipse cx="31" cy="73" rx="2.2" ry="1.3" fill="url(#novaSealGold)" stroke="none" transform="rotate(-30 31 73)" />
        <ellipse cx="29.5" cy="77" rx="2.2" ry="1.3" fill="url(#novaSealGold)" stroke="none" transform="rotate(-15 29.5 77)" />

        <path d="M60 82 C66 80 70 76 71 71" />
        <ellipse cx="69" cy="73" rx="2.2" ry="1.3" fill="url(#novaSealGold)" stroke="none" transform="rotate(30 69 73)" />
        <ellipse cx="70.5" cy="77" rx="2.2" ry="1.3" fill="url(#novaSealGold)" stroke="none" transform="rotate(15 70.5 77)" />
      </g>
    </svg>
  );
}
