'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 25, mass: 0.8 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 25, mass: 0.8 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/tools?q=${encodeURIComponent(query)}` : '/tools');
  }

  return (
    <section onMouseMove={handleMouseMove} className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:px-8">
      <motion.div
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-[0.08] blur-3xl will-change-transform"
        style={{
          left: glowX,
          top: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(201,169,97,0.5), transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-glow" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-400/30 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary-600 dark:text-primary-400"
        >
          NovaTools
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance font-heading text-4xl font-semibold leading-[1.15] tracking-tight sm:text-6xl"
        >
          Free Online Tools <br className="hidden sm:block" />
          <span className="text-gradient">That Save You Time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-base text-black/60 dark:text-white/60 sm:text-lg"
        >
          Everything you need. No installation. Most tools need no signup — just open and use.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-black/10 bg-white/70 p-2 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
        >
          <Search className="ml-2 h-5 w-5 shrink-0 text-black/40 dark:text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to do today?"
            className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-black/40 dark:placeholder:text-white/40 sm:text-base"
          />
          <Button type="submit" size="md">
            Search <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-black/50 dark:text-white/50"
        >
          <span>Trending:</span>
          {['Password Generator', 'JSON Formatter', 'EMI Calculator', 'QR Generator'].map((t) => (
            <button
              key={t}
              onClick={() => router.push(`/tools?q=${encodeURIComponent(t)}`)}
              className="rounded-full border border-black/10 px-3 py-1 transition-colors hover:border-primary-400/50 hover:text-primary-500 dark:border-white/10"
            >
              {t}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
