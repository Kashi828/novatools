'use client';

import { useEffect, useState } from 'react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function AdminToolsPanel() {
  const [hiddenSlugs, setHiddenSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tool-visibility')
      .then((res) => res.json())
      .then((data) => setHiddenSlugs(new Set(data.hiddenSlugs ?? [])))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(slug: string, currentlyHidden: boolean) {
    setPending(slug);
    const nextHidden = !currentlyHidden;
    setHiddenSlugs((prev) => {
      const next = new Set(prev);
      if (nextHidden) next.add(slug);
      else next.delete(slug);
      return next;
    });
    try {
      await fetch('/api/admin/tool-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, hidden: nextHidden }),
      });
    } finally {
      setPending(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat.slug);
        if (catTools.length === 0) return null;
        return (
          <div key={cat.slug}>
            <h3 className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold">
              <cat.icon className="h-4 w-4 text-primary-500" /> {cat.name}
              <span className="text-xs font-normal text-black/40 dark:text-white/40">({catTools.length})</span>
            </h3>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {catTools.map((tool) => {
                const hidden = hiddenSlugs.has(tool.slug);
                return (
                  <button
                    key={tool.slug}
                    onClick={() => toggle(tool.slug, hidden)}
                    disabled={pending === tool.slug}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
                      hidden
                        ? 'border-danger/30 bg-danger/5 text-black/50 dark:text-white/50'
                        : 'border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/5'
                    }`}
                  >
                    <span className={hidden ? 'line-through' : ''}>{tool.name}</span>
                    {hidden ? <EyeOff className="h-4 w-4 shrink-0 text-danger" /> : <Eye className="h-4 w-4 shrink-0 text-success" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
