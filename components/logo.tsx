import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 120" className={cn('h-8 w-8', className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="novaLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <radialGradient id="novaLogoCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M60 15 L98.97 82.5 L21.03 82.5 Z M60 105 L21.03 37.5 L98.97 37.5 Z"
        fill="url(#novaLogoGradient)"
        fillRule="evenodd"
        stroke="url(#novaLogoGradient)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="60" r="16" fill="url(#novaLogoCore)" />
    </svg>
  );
}
