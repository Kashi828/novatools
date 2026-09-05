'use client';

import { motion, type Variants } from 'framer-motion';
import type { PropsWithChildren } from 'react';

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.055, delayChildren: 0.04 } } };

export function HomeMotion({ children }: PropsWithChildren) { return <motion.div variants={container} initial="hidden" animate="show">{children}</motion.div>; }
