'use client';
import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Crown, Shield, RefreshCw, Save, Settings2 } from 'lucide-react';
import { categories } from '@/data/categories';
import { tools } from '@/data/tools';

export function AdminControlPanel() {
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [premiumTools, setPremiumTools] = useState<string[]>([]);
  const [featureSettings, setFeatureSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  async function refresh() {
    setLoading(true);
    try {
      const [c, p, s] = await Promise.all([
        fetch('/api/admin/category-visibility', { cache: 'no-store' }).then(r => r.json()),
        fetch('/api/admin/tool-premium', { cache: 'no-store' }).then(r => r.json()),
        fetch('/api/admin/feature-settings', { cache: 'no-store' }).then(r => r.json()),
      ]);
      setHiddenCategories(c.hiddenCategories ?? []);
      setPremiumTools(p.premiumTools ?? []);
      setFeatureSettings(s.settings ?? null);
      setMessage('');
    } catch { setMessage('Could not load admin controls.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);

  async function post(url: string, body: object) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error();
    return r.json();
  }
  async function toggleCategory(slug: string) {
    try { const hidden = hiddenCategories.includes(slug); await post('/api/admin/category-visibility', { slug, hidden: !hidden }); await refresh(); }
    catch { setMessage('Could not update category visibility.'); }
  }
  async function togglePremium(slug: string) {
    try { const premium = premiumTools.includes(slug); await post('/api/admin/tool-premium', { slug, premium: !premium }); await refresh(); }
    catch { setMessage('Could not update premium flag.'); }
  }
  async function saveSettings() {
    if (!featureSettings) return;
    try { await fetch('/api/admin/feature-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(featureSettings) }); setMessage('Admin settings saved.'); }
    catch { setMessage('Could not save settings.'); }
  }
  const filtered = useMemo(() => tools.filter(t => (!query || `${t.name} ${t.shortDescription}`.toLowerCase().includes(query.toLowerCase())) && (category === 'all' || t.category === category)), [query, category]);

  if (loading) return <div className="flex justify-center py-8"><RefreshCw className="h-5 w-5 animate-spin text-primary-500" /></div>;
  return <div className="space-y-8">
    <section className="nova-surface rounded-2xl p-5">
      <div className="flex items-center gap-2"><EyeOff className="h-4 w-4 text-primary-500" /><h3 className="font-heading font-semibold">Category visibility</h3></div>
      <p className="mt-1 text-sm nova-muted">Hide an entire category from public discovery without deleting its tools.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{categories.map(c => { const hidden = hiddenCategories.includes(c.slug); return <button key={c.slug} onClick={() => void toggleCategory(c.slug)} className="flex items-center justify-between rounded-xl border border-black/10 p-3 text-left dark:border-white/10"><span>{c.name}</span>{hidden ? <EyeOff className="h-4 w-4 text-danger" /> : <Eye className="h-4 w-4 text-success" />}</button>; })}</div>
    </section>
    <section className="nova-surface rounded-2xl p-5">
      <div className="flex items-center gap-2"><Crown className="h-4 w-4 text-primary-500" /><h3 className="font-heading font-semibold">Premium flags</h3></div>
      <p className="mt-1 text-sm nova-muted">Promote any tool to premium from admin without changing the source registry.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools..." className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" /><select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"><option value="all">All categories</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
      <div className="mt-4 max-h-80 space-y-1.5 overflow-y-auto">{filtered.map(t => { const premium = premiumTools.includes(t.slug); return <button key={t.slug} onClick={() => void togglePremium(t.slug)} className="flex w-full items-center justify-between rounded-lg border border-black/10 px-3 py-2 text-left dark:border-white/10"><span className="truncate">{t.name}</span>{premium ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500"><Crown className="h-3.5 w-3.5" /> Premium</span> : <span className="text-xs nova-muted">Free</span>}</button>; })}</div>
    </section>
    <section className="nova-surface rounded-2xl p-5">
      <div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary-500" /><h3 className="font-heading font-semibold">Moderation & site controls</h3></div>
      {featureSettings && <div className="mt-4 space-y-3"><label className="flex items-center justify-between rounded-lg border border-black/10 p-3 dark:border-white/10"><span>Comments enabled</span><input type="checkbox" checked={featureSettings.commentsEnabled} onChange={e => setFeatureSettings({ ...featureSettings, commentsEnabled: e.target.checked })} /></label><label className="flex items-center justify-between rounded-lg border border-black/10 p-3 dark:border-white/10"><span>Contact form enabled</span><input type="checkbox" checked={featureSettings.contactsEnabled} onChange={e => setFeatureSettings({ ...featureSettings, contactsEnabled: e.target.checked })} /></label><label className="flex items-center justify-between rounded-lg border border-black/10 p-3 dark:border-white/10"><span>Anonymous comments</span><input type="checkbox" checked={featureSettings.allowAnonymousComments} onChange={e => setFeatureSettings({ ...featureSettings, allowAnonymousComments: e.target.checked })} /></label><textarea value={featureSettings.maintenanceNotice} onChange={e => setFeatureSettings({ ...featureSettings, maintenanceNotice: e.target.value })} placeholder="Maintenance notice (optional)" maxLength={180} className="w-full rounded-xl border border-black/10 bg-transparent p-3 text-sm dark:border-white/10" /><button onClick={() => void saveSettings()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white"><Save className="h-4 w-4" /> Save controls</button></div>}
    </section>
    {message && <p className="text-sm text-danger">{message}</p>}
  </div>;
}
