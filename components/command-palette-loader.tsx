'use client';

import dynamic from 'next/dynamic';

const CommandPalette = dynamic(
  () => import('@/components/command-palette').then((mod) => mod.CommandPalette),
  { ssr: false, loading: () => null }
);

export function CommandPaletteLoader() {
  return <CommandPalette />;
}
