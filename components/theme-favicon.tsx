'use client';

import { useEffect } from 'react';
import { useTheme } from '@/components/theme-provider';

function buildFavicon(primary: string, secondary: string, accent: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${secondary}"/></linearGradient><linearGradient id="b" x1="1" y1="0" x2="0" y2="1"><stop stop-color="${secondary}"/><stop offset="1" stop-color="${primary}"/></linearGradient><linearGradient id="c" x1="0" y1="1" x2="1" y2="0"><stop stop-color="${accent}"/><stop offset="1" stop-color="${primary}"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="#0A0A0B"/><g transform="translate(50 48)"><path d="M0 -4 C 14 -30 34 -34 44 -18 C 30 -14 14 -8 0 -4 Z" fill="url(#a)"/><path d="M0 -4 C 14 -30 34 -34 44 -18 C 30 -14 14 -8 0 -4 Z" fill="url(#b)" transform="rotate(120)"/><path d="M0 -4 C 14 -30 34 -34 44 -18 C 30 -14 14 -8 0 -4 Z" fill="url(#c)" transform="rotate(240)"/><circle r="8" fill="${primary}"/></g></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function ThemeFavicon() {
  const { colorTheme, customColors } = useTheme();

  useEffect(() => {
    const presets: Record<string, [string, string, string]> = {
      gold: ['#D4BB7C', '#C9A961', '#A97142'],
      emerald: ['#52C298', '#34A876', '#1D6B49'],
      sapphire: ['#6690E3', '#3E6FD9', '#22428A'],
      rose: ['#D99BA8', '#C97A8B', '#863F4E'],
      monochrome: ['#CCCCCC', '#B8B8B8', '#6E6E6E'],
    };
    const [primary, secondary, accent] = colorTheme === 'custom'
      ? [customColors.primary, customColors.secondary, customColors.accent]
      : presets[colorTheme] ?? presets.gold;

    const href = buildFavicon(primary, secondary, accent);
    for (const selector of ['link[rel="icon"]', 'link[data-novatools-favicon]']) {
      document.querySelectorAll(selector).forEach((node) => node.remove());
    }
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = href;
    link.setAttribute('data-novatools-favicon', 'true');
    document.head.appendChild(link);
  }, [colorTheme, customColors]);

  return null;
}
