'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, EyeOff, Filter, RefreshCw, Search, Sparkles } from 'lucide-react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

export function AdminOperationsPanel() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [hiddenSlugs, setHiddenSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/tool-visibility', { cache: 'no-store' });
      const data = await res.json();
      setHiddenSlugs(new Set(data.hiddenSlugs ?? []));
      setMessage(null);
    } catch {
      setMessage('Could not refresh visibility settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  const filtered = useMemo(() => tools.filter((tool) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${tool.name} ${tool.shortDescription} ${tool.keywords.join(' ')}`.toLowerCase().includes(needle);
    const matchesCategory = category === 'all' || tool.category === category;
    const hidden = hiddenSlugs.has(tool.slug);
    const matchesStatus = status === 'all' || (status === 'visible' && !hidden) || (status === 'hidden' && hidden) || (status === 'premium' && tool.premium) || (status === 'new' && tool.isNew);
    return matchesQuery && matchesCategory && matchesStatus;
  }), [query, category, status, hiddenSlugs]);

  async function setVisibility(slug: string, hidden: boolean) {
    const previous = hiddenSlugs;
    setHiddenSlugs((current) => {
      const next = new Set(current);
      if (hidden) next.add(slug); else next.delete(slug);
      return next;
    });
    try {
      const res = await fetch('/api/admin/tool-visibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, hidden }) });
      if (!res.ok) throw new Error();
    } catch {
      setHiddenSlugs(previous);
      setMessage(`Could not update ${slug}.`);
    }
  }

  async function setFilteredVisibility(hidden: boolean) {
    if (!filtered.length) return;
    if (hidden && !window.confirm(`Hide ${filtered.length} matching tools from public discovery?`)) return;
    setBusy(true);
    setMessage(null);
    let failed = 0;
    for (const tool of filtered) {
      try {
        const res = await fetch('/api/admin/tool-visibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: tool.slug, hidden }) });
        if (!res.ok) failed += 1;
      } catch { failed += 1; }
    }
    if (failed) setMessage(`${failed} tool${failed === 1 ? '' : 's'} could not be updated.`);
    else setMessage(`${filtered.length} tool${filtered.length === 1 ? '' : 's'} ${hidden ? 'hidden' : 'made visible'}.`);
    setBusy(false);
    await refresh();
  }

  function exportCatalogue() {
    const payload = tools.map((tool) => ({
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      keywords: tool.keywords,
      premium: tool.premium ?? false,
      featured: tool.featured ?? false,
      trending: tool.trending ?? false,
      isNew: tool.isNew ?? false,
      hidden: hiddenSlugs.has(tool.slug),
    }));
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), tools: payload }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `novatools-catalogue-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const visibleCount = tools.filter((tool) => !hiddenSlugs.has(tool.slug)).length;
  const hiddenCount = tools.length - visibleCount;
  const premiumCount = tools.filter((tool) => tool.premium).length;
  const newCount = tools.filter((tool) => tool.isNew).length;
  const categoryOptions = [{ value: 'all', label: 'All categories' }, ...categories.map((item) => ({ value: item.slug, label: item.name }))];
  const statusOptions = [{ value: 'all', label: 'All status' }, { value: 'visible', label: 'Visible' }, { value: 'hidden', label: 'Hidden' }, { value: 'premium', label: 'Premium' }, { value: 'new', label: 'New' }];

  return (
    <div className="space-y-4 rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Visible', visibleCount], ['Hidden', hiddenCount], ['Premium', premiumCount], ['New', newCount]].map(([label, value]) => <div key={label} className="rounded-xl border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5"><div className="font-heading text-xl font-bold">{value}</div><div className="text-xs text-black/50 dark:text-white/50">{label}</div></div>)}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-black/35 dark:text-white/35" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools..." className="w-full rounded-xl border border-black/10 bg-white/60 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5" /></label>
        <Select value={category} onChange={setCategory} options={categoryOptions} className="md:w-52" />
        <Select value={status} onChange={setStatus} options={statusOptions} className="md:w-40" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={busy || loading || !filtered.length} onClick={() => void setFilteredVisibility(false)}><Eye className="h-4 w-4" /> Show filtered</Button>
        <Button size="sm" variant="outline" disabled={busy || loading || !filtered.length} onClick={() => void setFilteredVisibility(true)}><EyeOff className="h-4 w-4" /> Hide filtered</Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void refresh()}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
        <Button size="sm" variant="secondary" onClick={exportCatalogue}><Download className="h-4 w-4" /> Export catalogue</Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-black/45 dark:text-white/45"><Filter className="h-3.5 w-3.5" /> {filtered.length} matching tool{filtered.length === 1 ? '' : 's'}</div>

      <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
        {filtered.map((tool) => {
          const hidden = hiddenSlugs.has(tool.slug);
          return <div key={tool.slug} className="flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white/50 px-3 py-2 dark:border-white/10 dark:bg-white/5"><div className="min-w-0"><div className={`truncate text-sm font-medium ${hidden ? 'line-through opacity-50' : ''}`}>{tool.name}</div><div className="text-[11px] text-black/40 dark:text-white/40">{tool.category}{tool.premium ? ' · Premium' : ''}{tool.isNew ? ' · New' : ''}</div></div><button type="button" disabled={busy} onClick={() => void setVisibility(tool.slug, !hidden)} className="shrink-0 rounded-lg p-2 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10" title={hidden ? 'Show tool' : 'Hide tool'}>{hidden ? <EyeOff className="h-4 w-4 text-danger" /> : <Eye className="h-4 w-4 text-success" />}</button></div>;
        })}
        {!filtered.length && <div className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-black/45 dark:border-white/10 dark:text-white/45">No tools match these filters.</div>}
      </div>

      {message && <p className="text-sm text-black/60 dark:text-white/60">{message}</p>}
      <div className="flex items-start gap-2 text-xs text-black/40 dark:text-white/40"><Sparkles className="mt-0.5 h-3.5 w-3.5" /> Bulk actions use the same protected admin visibility API as the existing tool controls.</div>
    </div>
  );
}
