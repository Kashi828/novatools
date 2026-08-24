'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Restrained hover: a small lift, no blur halo, no spring bounce. */
export function CardHoverWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="group relative h-full">
      {children}
    </motion.div>
  );
}

export function IconHoverWrapper({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow transition-transform duration-200 group-hover:scale-105">
      {children}
    </span>
  );
}
