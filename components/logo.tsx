import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * A restrained monogram mark — a thin gold ring with a serif "N", plus two hairline
 * flourishes above and below the letter. Deliberately quiet rather than a bright
 * multi-color icon: the goal is to read as an engraved crest, not a tech app icon.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('h-8 w-8', className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="novaGoldRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4BB7C" />
          <stop offset="50%" stopColor="#C9A961" />
          <stop offset="100%" stopColor="#A97142" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#novaGoldRing)" strokeWidth="2" />
      <line x1="50" y1="20" x2="50" y2="27" stroke="url(#novaGoldRing)" strokeWidth="1.5" />
      <line x1="50" y1="73" x2="50" y2="80" stroke="url(#novaGoldRing)" strokeWidth="1.5" />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="46"
        fill="url(#novaGoldRing)"
      >
        N
      </text>
    </svg>
  );
}
