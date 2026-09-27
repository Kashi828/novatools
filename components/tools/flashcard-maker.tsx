'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface Card {
  term: string;
  definition: string;
}

const DEFAULT_CARDS: Card[] = [
  { term: 'Mitochondria', definition: 'The powerhouse of the cell' },
  { term: 'Photosynthesis', definition: 'Process plants use to convert light into energy' },
];

export function FlashcardMaker() {
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');

  function addCard() {
    if (!term.trim() || !definition.trim()) return;
    setCards((prev) => [...prev, { term, definition }]);
    setTerm('');
    setDefinition('');
  }

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  }
  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }
  function shuffleCards() {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  }

  const current = cards[index];

  return (
    <ToolShell shareSlug="flashcard-maker">
      <div className="grid gap-2 sm:grid-cols-2">
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term" className="rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
        <input value={definition} onChange={(e) => setDefinition(e.target.value)} placeholder="Definition" className="rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" />
      </div>
      <Button size="sm" variant="outline" onClick={addCard}>+ Add card</Button>

      {cards.length > 0 && current && (
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-black/50 dark:text-white/50">Card {index + 1} of {cards.length}</p>
          <div style={{ perspective: 1000 }} className="h-56 w-full max-w-md cursor-pointer" onClick={() => setFlipped((f) => !f)}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative h-full w-full"
            >
              <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 flex items-center justify-center rounded-xl2 bg-gradient-brand p-6 text-center font-heading text-2xl font-semibold text-white shadow-glow">
                {current.term}
              </div>
              <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0 flex items-center justify-center rounded-xl2 border border-primary-400 bg-white p-6 text-center text-lg dark:bg-[#111113]">
                {current.definition}
              </div>
            </motion.div>
          </div>
          <p className="text-xs text-black/40 dark:text-white/40">Click the card to flip</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={shuffleCards}><Shuffle className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
