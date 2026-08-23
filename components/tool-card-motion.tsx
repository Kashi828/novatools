'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Client-only hover wrapper. Takes only ReactNode children (already-rendered elements
 * from the server), never raw component references, so it's safe to import from
 * server-rendered pages without crossing the RSC serialization boundary incorrectly. */
export function CardHoverWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="group relative h-full">
      {children}
    </motion.div>
  );
}

export function IconHoverWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.span
      whileHover={{ rotate: 6, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow"
    >
      {children}
    </motion.span>
  );
}
