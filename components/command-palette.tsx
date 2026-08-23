'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { tools } from '@/data/tools';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-xl"
          >
            <Command
              onClick={(e) => e.stopPropagation()}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-[#0F1729]"
            >
              <div className="flex items-center gap-2 border-b border-black/10 px-4 dark:border-white/10">
                <Search className="h-4 w-4 text-black/40 dark:text-white/40" />
                <Command.Input
                  autoFocus
                  placeholder="Search 200+ tools..."
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="p-4 text-center text-sm text-black/50 dark:text-white/50">No tools found.</Command.Empty>
                {tools.map((tool) => (
                  <Command.Item
                    key={tool.slug}
                    value={`${tool.name} ${tool.keywords.join(' ')}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/tools/${tool.slug}`);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-white/10"
                  >
                    <tool.icon className="h-4 w-4 text-primary-500" />
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-black/50 dark:text-white/50">{tool.shortDescription}</div>
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
