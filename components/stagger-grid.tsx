'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div initial="hidden" animate="show" variants={container} className={className}>{children}</motion.div>;
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return <motion.div variants={item}>{children}</motion.div>;
}
