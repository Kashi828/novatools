'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[] | string[];
  className?: string;
  placeholder?: string;
}

function normalize(options: SelectOption[] | string[]): SelectOption[] {
  return options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
}

export function Select({ value, onChange, options, className, placeholder }: SelectProps) {
  const normalized = normalize(options);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = normalized.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (open) setHighlighted(Math.max(0, normalized.findIndex((o) => o.value === value)));
  }, [open, value, normalized]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(normalized.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = normalized[highlighted];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
      }
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-white/60 p-3 text-left text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
      >
        <span className={selected ? '' : 'text-black/40 dark:text-white/40'}>
          {selected?.label ?? placeholder ?? 'Select...'}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-black/40 transition-transform dark:text-white/40', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-black/10 bg-white shadow-glass dark:border-white/10 dark:bg-[#0F1729]"
        >
          {normalized.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'flex cursor-pointer items-center justify-between px-3 py-2 text-sm',
                i === highlighted && 'bg-primary-50 dark:bg-white/10',
                opt.value === value && 'font-medium text-primary-600 dark:text-primary-400'
              )}
            >
              {opt.label}
              {opt.value === value && <Check className="h-3.5 w-3.5" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
