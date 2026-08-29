'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

/** Keep route changes responsive: both routes overlap briefly instead of waiting
 * for the outgoing view to complete before the next one may render. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.75 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
