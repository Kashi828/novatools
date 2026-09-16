'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Activity, Archive, Check, ChevronRight, CircleAlert, Clipboard, Cloud, Crown, Database, Download, Eye, EyeOff, ExternalLink, Flag, Gauge, Globe2, Inbox, LayoutDashboard, Loader2, Mail, MessageSquare, Moon, RefreshCw, Rocket, Save, Search, Send, Settings2, Shield, Sparkles, Trash2, Wrench, Zap } from 'lucide-react';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import type { AdminFeatureSettings } from '@/lib/admin-feature-settings';
import type { SiteSettings } from '@/lib/site-settings';

type Tab = 'overview' | 'inbox' | 'tools' | 'site' | 'system';
type InboxMode = 'comments' | 'contacts';
type CommentStatus = 'visible' | 'flagged' | 'hidden';
type ContactStatus = 'read' | 'unread';

type CommentRow = { id: string; name: string; text: string; createdAt: string; status: CommentStatus };
type ContactRow = { id: string; name: string; email: string; message: string; createdAt: string; status: ContactStatus };
type DashboardData = {
  checkedAt: string;
  uptime: string;
  redis: { ok: boolean; latencyMs: number | null };
  environment: { clerk: boolean; redis: boolean; gemini: boolean; adminEmail: boolean };
  toolTotal: number;
  hiddenTools: string[];
  premiumTools: string[];
  comments: CommentRow[];
  contacts: ContactRow[];
  featureSettings: AdminFeatureSettings;
  siteSettings: SiteSettings;
  categoryCounts: Array<{ slug: string; name: string; toolCount: number; hidden: boolean }>;
};

const tabItems: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'tools', label: 'Catalogue', icon: Wrench },
  { id: 'site', label: 'Site controls', icon: Globe2 },
  { id: 'system', label: 'System', icon: Shield },
];

export function AdminControlCenter() {
  const [tab, setTab] = useState<Tab>('overview');
  const [inboxMode, setInboxMode] = useState<InboxMode>('comments');
  const [data, setData] = useState<DashboardData | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toolFilter, setToolFilter] = useState('all');
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      setData(await response.json());
      setToast(null);
    } catch { setToast('Control center could not load the live admin state.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setBooting(false), reduced ? 180 : 1100);
    void load();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function mutate(key: string, url: string, body: object) {
    setBusy(key);
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error();
      await load();
      setToast('Control updated successfully.');
    } catch { setToast('That control could not be updated.'); }
    finally { setBusy(null); }
  }

  async function saveFeatureSettings() {
    if (!data) return;
    setBusy('feature-settings');
    try {
      const response = await fetch('/api/admin/feature-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data.featureSettings) });
      if (!response.ok) throw new Error();
      await load();
      setToast('Interaction settings saved.');
    } catch { setToast('Could not save interaction settings.'); }
    finally { setBusy(null); }
  }

  async function saveSiteSettings() {
    if (!data) return;
    setBusy('site-settings');
    try {
      const response = await fetch('/api/admin/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data.siteSettings) });
      if (!response.ok) throw new Error();
      await load();
      setToast('Public site settings saved.');
    } catch { setToast('Could not save public site settings.'); }
    finally { setBusy(null); }
  }

  async function removeComment(id: string) {
    if (!window.confirm('Delete this comment permanently?')) return;
    setBusy(`comment-${id}`);
    try {
      const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      await load();
      setToast('Comment deleted.');
    } catch { setToast('Could not delete the comment.'); }
    finally { setBusy(null); }
  }

  async function removeContact(id: string) {
    if (!window.confirm('Delete this contact message permanently?')) return;
    setBusy(`contact-${id}`);
    try {
      const response = await fetch('/api/admin/contacts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!response.ok) throw new Error();
      await load();
      setToast('Contact message deleted.');
    } catch { setToast('Could not delete the contact message.'); }
    finally { setBusy(null); }
  }

  function exportSnapshot() {
    if (!data) return;
    const snapshot = { exportedAt: new Date().toISOString(), toolTotal: data.toolTotal, hiddenTools: data.hiddenTools, premiumTools: data.premiumTools, categoryCounts: data.categoryCounts, featureSettings: data.featureSettings, siteSettings: data.siteSettings, comments: data.comments, contacts: data.contacts };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `novatools-admin-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast('Admin snapshot exported.');
  }

  async function copyDiagnostics() {
    if (!data) return;
    const text = `NovaTools diagnostics\nChecked: ${data.checkedAt}\nUptime: ${data.uptime}\nRedis: ${data.redis.ok ? 'online' : 'offline'}${data.redis.latencyMs == null ? '' : ` (${data.redis.latencyMs}ms)`}\nTools: ${data.toolTotal}\nHidden tools: ${data.hiddenTools.length}\nPremium flags: ${data.premiumTools.length}\nComments: ${data.comments.length}\nContacts: ${data.contacts.length}`;
    await navigator.clipboard.writeText(text);
    setToast('Diagnostics copied to clipboard.');
  }

  const filteredTools = useMemo(() => {
    if (!data) return [];
    const needle = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesQuery = !needle || `${tool.name} ${tool.shortDescription} ${tool.keywords.join(' ')}`.toLowerCase().includes(needle);
      const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
      const hidden = data.hiddenTools.includes(tool.slug);
      const premium = data.premiumTools.includes(tool.slug) || Boolean(tool.premium);
      const matchesFilter = toolFilter === 'all' || (toolFilter === 'visible' && !hidden) || (toolFilter === 'hidden' && hidden) || (toolFilter === 'premium' && premium) || (toolFilter === 'free' && !premium);
      return matchesQuery && matchesCategory && matchesFilter;
    });
  }, [data, query, categoryFilter, toolFilter]);

  if (booting) return <BootScreen />;
  if (loading && !data) return <BootScreen loading />;
  if (!data) return <div className="min-h-screen px-4 py-20 text-center"><CircleAlert className="mx-auto h-10 w-10 text-danger" /><h1 className="mt-4 font-heading text-2xl font-bold">Admin systems unavailable</h1><p className="mt-2 nova-muted">Refresh the page after checking the server logs and Redis connection.</p><button onClick={() => void load()} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"><RefreshCw className="h-4 w-4" /> Retry</button></div>;

  const unreadContacts = data.contacts.filter((item) => item.status === 'unread').length;
  const flaggedComments = data.comments.filter((item) => item.status === 'flagged').length;
  const hiddenToolsCount = data.hiddenTools.length;
  const visibleToolsCount = Math.max(0, data.toolTotal - hiddenToolsCount);
  const premiumCount = new Set([...data.premiumTools, ...tools.filter((tool) => tool.premium).map((tool) => tool.slug)]).size;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-80 [background-image:radial-gradient(circle_at_top_right,rgba(0,238,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(140,80,255,0.13),transparent_32%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:auto,auto,44px_44px,44px_44px]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-3 py-3 sm:px-5 lg:px-6">
        <header className="sticky top-3 z-30 mb-4 rounded-2xl border border-cyan-300/10 bg-[#080a11]/90 p-3 shadow-[0_0_50px_rgba(0,238,255,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300"><Zap className="h-5 w-5" /><span className="absolute inset-0 animate-ping rounded-xl border border-cyan-300/20" /></div>
              <div className="min-w-0"><div className="flex items-center gap-2"><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">NOVATOOLS // ADMIN</span><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">SECURE</span></div><h1 className="truncate font-heading text-lg font-semibold sm:text-xl">Cyber Control Center</h1></div>
            </div>
            <div className="flex flex-wrap items-center gap-2"><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 hover:border-cyan-300/30 hover:text-white"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync</button><button onClick={exportSnapshot} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 hover:border-cyan-300/30 hover:text-white"><Archive className="h-3.5 w-3.5" /> Export</button><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/15"><ExternalLink className="h-3.5 w-3.5" /> Open site</a></div>
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[220px_1fr]">
          <aside className="h-max rounded-2xl border border-white/10 bg-[#080a11]/85 p-2 backdrop-blur-xl lg:sticky lg:top-[100px]">
            <div className="px-3 pb-2 pt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">Control layers</div>
            <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
              {tabItems.map((item) => { const Icon = item.icon; const active = tab === item.id; const badge = item.id === 'inbox' ? unreadContacts + flaggedComments : 0; return <button key={item.id} onClick={() => setTab(item.id)} className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${active ? 'border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[inset_0_0_20px_rgba(0,238,255,0.06)]' : 'border border-transparent text-white/55 hover:bg-white/[0.04] hover:text-white'}`}><span className="flex items-center gap-2.5"><Icon className={`h-4 w-4 ${active ? 'text-cyan-300' : 'text-white/35 group-hover:text-white/60'}`} />{item.label}</span>{badge > 0 && <span className="rounded-full bg-fuchsia-400/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-300">{badge}</span>}</button>; })}
            </nav>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3"><div className="font-mono text-[10px] uppercase tracking-wider text-white/35">Live node</div><div className="mt-2 flex items-center gap-2 text-xs text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Admin session active</div><div className="mt-1 text-[11px] text-white/35">{data.uptime} uptime</div></div>
          </aside>

          <main className="min-w-0 pb-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {tab === 'overview' && <Overview data={data} visibleToolsCount={visibleToolsCount} hiddenToolsCount={hiddenToolsCount} premiumCount={premiumCount} unreadContacts={unreadContacts} flaggedComments={flaggedComments} onDiagnostics={copyDiagnostics} />}
                {tab === 'inbox' && <InboxPanel mode={inboxMode} setMode={setInboxMode} comments={data.comments} contacts={data.contacts} busy={busy} onCommentAction={(id, status) => void mutate(`comment-status-${id}`, '/api/admin/comments', { id, status })} onDeleteComment={removeComment} onContactAction={(id, read) => void mutate(`contact-read-${id}`, '/api/admin/contacts', { id, read })} onDeleteContact={removeContact} />}
                {tab === 'tools' && <CataloguePanel tools={filteredTools} data={data} query={query} setQuery={setQuery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} toolFilter={toolFilter} setToolFilter={setToolFilter} categories={categories} busy={busy} onToolVisibility={(slug, hidden) => void mutate(`tool-${slug}`, '/api/admin/tool-visibility', { slug, hidden })} onToolPremium={(slug, premium) => void mutate(`premium-${slug}`, '/api/admin/tool-premium', { slug, premium })} />}
                {tab === 'site' && <SitePanel data={data} setData={setData} busy={busy} onSaveFeatures={saveFeatureSettings} onSaveSite={saveSiteSettings} onCategoryToggle={(slug, hidden) => void mutate(`category-${slug}`, '/api/admin/category-visibility', { slug, hidden })} />}
                {tab === 'system' && <SystemPanel data={data} onRefresh={() => void load()} onDiagnostics={copyDiagnostics} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        {toast && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-2 rounded-xl border border-cyan-300/20 bg-[#0a0d15]/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-xl"><Check className="h-4 w-4 text-emerald-300" />{toast}</motion.div>}
      </div>
    </div>
  );
}

function BootScreen({ loading = false }: { loading?: boolean }) {
  return <div className="min-h-screen bg-[#05060a] text-white"><div className="relative flex min-h-screen items-center justify-center overflow-hidden"><div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:44px_44px]" /><motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }} className="relative w-[min(520px,92vw)] rounded-2xl border border-cyan-300/15 bg-[#080a11]/95 p-6 shadow-[0_0_80px_rgba(0,238,255,0.1)]"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10"><Shield className="h-5 w-5 text-cyan-300" /></div><div><div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">BOOT SEQUENCE</div><div className="font-heading font-semibold">NovaTools secure console</div></div></div><div className="mt-6 space-y-2 font-mono text-[11px] text-white/45"><BootLine text="auth handshake" /><BootLine text="loading catalogue index" /><BootLine text="connecting to redis" /><BootLine text={loading ? 'hydrating live telemetry' : 'mounting control layers'} /></div><div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: loading ? 1.2 : 0.9, repeat: Infinity, ease: 'linear' }} className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" /></div></motion.div></div></div>;
}
function BootLine({ text }: { text: string }) { return <div className="flex gap-2"><span className="text-emerald-300">OK</span><span>{text}</span></div>; }

function Overview({ data, visibleToolsCount, hiddenToolsCount, premiumCount, unreadContacts, flaggedComments, onDiagnostics }: { data: DashboardData; visibleToolsCount: number; hiddenToolsCount: number; premiumCount: number; unreadContacts: number; flaggedComments: number; onDiagnostics: () => void }) {
  const health = [data.environment.clerk, data.environment.redis, data.environment.gemini, data.environment.adminEmail].filter(Boolean).length;
  return <div className="space-y-4"><div className="rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[0.08] via-[#090b13] to-fuchsia-400/[0.06] p-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/65"><Sparkles className="h-3.5 w-3.5" />Command overview</div><h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Everything important in one scan.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">Use this layer for health, content pressure, catalogue state and fast operational actions without digging through separate pages.</p></div><div className="flex flex-wrap gap-2"><button onClick={onDiagnostics} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 hover:border-cyan-300/25"><Clipboard className="h-3.5 w-3.5" /> Copy diagnostics</button><a href="/feedback" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 hover:border-cyan-300/25"><MessageSquare className="h-3.5 w-3.5" /> Feedback</a><a href="/contact" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 hover:border-cyan-300/25"><Mail className="h-3.5 w-3.5" /> Contact</a></div></div></div>
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Wrench} label="Catalogue" value={data.toolTotal} detail={`${visibleToolsCount} visible · ${hiddenToolsCount} hidden`} tone="cyan" /><Metric icon={Crown} label="Premium flags" value={premiumCount} detail="Dynamic + registry flags" tone="fuchsia" /><Metric icon={Inbox} label="Inbox" value={unreadContacts + flaggedComments} detail={`${unreadContacts} unread · ${flaggedComments} flagged`} tone="amber" /><Metric icon={Gauge} label="System health" value={`${health}/4`} detail={`${data.redis.ok ? 'Redis online' : 'Redis offline'} · ${data.uptime}`} tone="emerald" /></div>
  <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]"><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center justify-between"><div><h3 className="font-heading font-semibold">Runtime pulse</h3><p className="mt-1 text-xs text-white/40">Latest server-side checks from the admin node.</p></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-mono text-[10px] text-emerald-300">LIVE</span></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Pulse label="Redis" value={data.redis.ok ? 'ONLINE' : 'OFFLINE'} sub={data.redis.latencyMs == null ? 'No ping' : `${data.redis.latencyMs} ms`} good={data.redis.ok} /><Pulse label="Clerk" value={data.environment.clerk ? 'READY' : 'MISSING'} sub="Auth secret" good={data.environment.clerk} /><Pulse label="Gemini" value={data.environment.gemini ? 'READY' : 'MISSING'} sub="AI key" good={data.environment.gemini} /></div></section><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center justify-between"><div><h3 className="font-heading font-semibold">Catalogue mix</h3><p className="mt-1 text-xs text-white/40">Top categories by tool count.</p></div><Activity className="h-4 w-4 text-cyan-300" /></div><div className="mt-5 space-y-3">{data.categoryCounts.slice().sort((a, b) => b.toolCount - a.toolCount).slice(0, 5).map((item) => <div key={item.slug}><div className="mb-1 flex items-center justify-between text-xs"><span className="text-white/65">{item.name}</span><span className="font-mono text-white/35">{item.toolCount}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400" style={{ width: `${Math.max(5, Math.min(100, (item.toolCount / Math.max(1, data.toolTotal)) * 100))}%` }} /></div></div>)}</div></section></div></div>;
}
function Metric({ icon: Icon, label, value, detail }: { icon: typeof Wrench; label: string; value: string | number; detail: string; tone: 'cyan' | 'fuchsia' | 'amber' | 'emerald' }) { return <div className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-4"><div className="flex items-center justify-between"><span className="text-xs text-white/40">{label}</span><Icon className="h-4 w-4 text-cyan-300" /></div><div className="mt-3 font-heading text-2xl font-bold">{value}</div><div className="mt-1 text-[11px] text-white/35">{detail}</div></div>; }
function Pulse({ label, value, sub, good }: { label: string; value: string; sub: string; good: boolean }) { return <div className="rounded-xl border border-white/10 bg-black/15 p-3"><div className="text-[10px] uppercase tracking-wider text-white/30">{label}</div><div className={`mt-2 text-sm font-semibold ${good ? 'text-emerald-300' : 'text-rose-300'}`}>{value}</div><div className="mt-1 font-mono text-[10px] text-white/35">{sub}</div></div>; }

function InboxPanel({ mode, setMode, comments, contacts, busy, onCommentAction, onDeleteComment, onContactAction, onDeleteContact }: { mode: InboxMode; setMode: (value: InboxMode) => void; comments: CommentRow[]; contacts: ContactRow[]; busy: string | null; onCommentAction: (id: string, status: CommentStatus) => void; onDeleteComment: (id: string) => void; onContactAction: (id: string, read: boolean) => void; onDeleteContact: (id: string) => void }) {
  const unread = contacts.filter((contact) => contact.status === 'unread').length;
  const flagged = comments.filter((comment) => comment.status === 'flagged').length;
  return <div className="space-y-4"><SectionHeader icon={Inbox} eyebrow="Inbox" title="User communications" description="Comments and contact messages live side by side, with moderation and read-state controls." /><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#090b12]/90 p-2"><div className="flex rounded-xl bg-black/20 p-1"><button onClick={() => setMode('comments')} className={`rounded-lg px-4 py-2 text-xs font-semibold ${mode === 'comments' ? 'bg-cyan-300/10 text-cyan-200' : 'text-white/45'}`}><MessageSquare className="mr-1.5 inline h-3.5 w-3.5" /> Comments {flagged > 0 && <span className="ml-1 text-fuchsia-300">{flagged}</span>}</button><button onClick={() => setMode('contacts')} className={`rounded-lg px-4 py-2 text-xs font-semibold ${mode === 'contacts' ? 'bg-cyan-300/10 text-cyan-200' : 'text-white/45'}`}><Mail className="mr-1.5 inline h-3.5 w-3.5" /> Contacts {unread > 0 && <span className="ml-1 text-amber-300">{unread}</span>}</button></div><span className="px-2 text-[11px] text-white/30">{mode === 'comments' ? `${comments.length} total comments` : `${contacts.length} total contact messages`}</span></div>{mode === 'comments' ? <div className="space-y-2">{comments.length ? comments.map((comment) => <CommentCard key={comment.id} item={comment} busy={busy} onAction={onCommentAction} onDelete={onDeleteComment} />) : <EmptyState icon={MessageSquare} label="No comments yet" />}</div> : <div className="space-y-2">{contacts.length ? contacts.map((contact) => <ContactCard key={contact.id} item={contact} busy={busy} onAction={onContactAction} onDelete={onDeleteContact} />) : <EmptyState icon={Mail} label="No contact messages yet" />}</div>}</div>;
}
function CommentCard({ item, busy, onAction, onDelete }: { item: CommentRow; busy: string | null; onAction: (id: string, status: CommentStatus) => void; onDelete: (id: string) => void }) { return <div className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-medium">{item.name}</span><StatusPill status={item.status} /><span className="font-mono text-[10px] text-white/25">{new Date(item.createdAt).toLocaleString()}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/60">{item.text}</p></div><div className="flex shrink-0 flex-wrap gap-1.5"><MiniButton label="Show" icon={Eye} active={item.status === 'visible'} onClick={() => onAction(item.id, 'visible')} disabled={busy === `comment-status-${item.id}`} /><MiniButton label="Flag" icon={Flag} active={item.status === 'flagged'} onClick={() => onAction(item.id, 'flagged')} disabled={busy === `comment-status-${item.id}`} /><MiniButton label="Hide" icon={EyeOff} active={item.status === 'hidden'} onClick={() => onAction(item.id, 'hidden')} disabled={busy === `comment-status-${item.id}`} /><MiniButton label="Delete" icon={Trash2} danger onClick={() => onDelete(item.id)} disabled={busy === `comment-${item.id}`} /></div></div></div>; }
function ContactCard({ item, busy, onAction, onDelete }: { item: ContactRow; busy: string | null; onAction: (id: string, read: boolean) => void; onDelete: (id: string) => void }) { return <div className={`rounded-2xl border p-4 ${item.status === 'unread' ? 'border-amber-300/20 bg-amber-300/[0.035]' : 'border-white/10 bg-[#090b12]/90'}`}><div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-medium">{item.name}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.status === 'unread' ? 'bg-amber-300/10 text-amber-300' : 'bg-white/5 text-white/35'}`}>{item.status.toUpperCase()}</span><a href={`mailto:${item.email}`} className="text-xs text-cyan-300 hover:underline">{item.email}</a><span className="font-mono text-[10px] text-white/25">{new Date(item.createdAt).toLocaleString()}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/60">{item.message}</p></div><div className="flex shrink-0 flex-wrap gap-1.5"><a href={`mailto:${item.email}?subject=Re: NovaTools contact`} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/15 bg-cyan-300/5 px-2.5 py-2 text-[11px] text-cyan-200"><Send className="h-3.5 w-3.5" /> Reply</a><MiniButton label={item.status === 'read' ? 'Unread' : 'Read'} icon={item.status === 'read' ? Moon : Check} onClick={() => onAction(item.id, item.status !== 'read')} disabled={busy === `contact-read-${item.id}`} /><MiniButton label="Delete" icon={Trash2} danger onClick={() => onDelete(item.id)} disabled={busy === `contact-${item.id}`} /></div></div></div>; }
function StatusPill({ status }: { status: CommentStatus }) { return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status === 'visible' ? 'bg-emerald-300/10 text-emerald-300' : status === 'flagged' ? 'bg-fuchsia-300/10 text-fuchsia-300' : 'bg-rose-300/10 text-rose-300'}`}>{status}</span>; }
function MiniButton({ label, icon: Icon, onClick, disabled, danger = false, active = false }: { label: string; icon: typeof Eye; onClick: () => void; disabled?: boolean; danger?: boolean; active?: boolean }) { return <button disabled={disabled} onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] transition ${danger ? 'border-rose-300/15 text-rose-300 hover:bg-rose-300/10' : active ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-white/45 hover:bg-white/[0.04] hover:text-white'} disabled:cursor-wait disabled:opacity-40`}><Icon className="h-3.5 w-3.5" />{label}</button>; }

function CataloguePanel({ tools: filteredTools, data, query, setQuery, categoryFilter, setCategoryFilter, toolFilter, setToolFilter, categories: categoryItems, busy, onToolVisibility, onToolPremium }: { tools: typeof tools; data: DashboardData; query: string; setQuery: (value: string) => void; categoryFilter: string; setCategoryFilter: (value: string) => void; toolFilter: string; setToolFilter: (value: string) => void; categories: typeof categories; busy: string | null; onToolVisibility: (slug: string, hidden: boolean) => void; onToolPremium: (slug: string, premium: boolean) => void }) { const premiumSet = new Set(data.premiumTools); return <div className="space-y-4"><SectionHeader icon={Wrench} eyebrow="Catalogue" title="Tool operations" description="Search, filter, hide, show and assign Premium status without leaving the control center." /><div className="grid gap-2 rounded-2xl border border-white/10 bg-[#090b12]/90 p-3 lg:grid-cols-[1fr_180px_140px]"><label className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/25" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, descriptions, keywords…" className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-300/30" /></label><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b0e17] px-3 py-2.5 text-sm text-white/70 outline-none"><option value="all">All categories</option>{categoryItems.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><select value={toolFilter} onChange={(event) => setToolFilter(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b0e17] px-3 py-2.5 text-sm text-white/70 outline-none"><option value="all">All states</option><option value="visible">Visible</option><option value="hidden">Hidden</option><option value="premium">Premium</option><option value="free">Free</option></select></div><div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-white/40"><span>{filteredTools.length} matching tools</span><span>{data.hiddenTools.length} hidden · {premiumSet.size} premium</span></div><div className="overflow-hidden rounded-2xl border border-white/10"><div className="hidden grid-cols-[1fr_120px_160px] border-b border-white/10 bg-white/[0.02] px-4 py-2 text-[10px] uppercase tracking-wider text-white/25 sm:grid"><span>Tool</span><span>Category</span><span className="text-right">Controls</span></div>{filteredTools.map((tool) => { const hidden = data.hiddenTools.includes(tool.slug); const premium = premiumSet.has(tool.slug) || Boolean(tool.premium); return <div key={tool.slug} className="grid gap-3 border-b border-white/5 px-4 py-3 last:border-0 sm:grid-cols-[1fr_120px_160px] sm:items-center"><div className="min-w-0"><div className={`truncate text-sm font-medium ${hidden ? 'text-white/30 line-through' : 'text-white/80'}`}>{tool.name}</div><div className="truncate text-[11px] text-white/30">{tool.shortDescription}</div></div><div className="text-[11px] text-white/35">{tool.category}</div><div className="flex justify-start gap-1.5 sm:justify-end"><MiniButton label={hidden ? 'Show' : 'Hide'} icon={hidden ? Eye : EyeOff} active={hidden} onClick={() => onToolVisibility(tool.slug, !hidden)} disabled={busy === `tool-${tool.slug}`} /><MiniButton label={premium ? 'Premium' : 'Free'} icon={Crown} active={premium} onClick={() => onToolPremium(tool.slug, !premium)} disabled={busy === `premium-${tool.slug}`} /></div></div>; })}{!filteredTools.length && <EmptyState icon={Search} label="No tools match these filters" />}</div></div>; }

function SitePanel({ data, setData, busy, onSaveFeatures, onSaveSite, onCategoryToggle }: { data: DashboardData; setData: React.Dispatch<React.SetStateAction<DashboardData | null>>; busy: string | null; onSaveFeatures: () => void; onSaveSite: () => void; onCategoryToggle: (slug: string, hidden: boolean) => void }) { return <div className="space-y-4"><SectionHeader icon={Settings2} eyebrow="Site controls" title="Public experience" description="Moderation, announcements, promo copy and category visibility are managed from one screen." /><div className="grid gap-4 xl:grid-cols-2"><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-cyan-300" /><h3 className="font-heading font-semibold">Interaction policy</h3></div><div className="mt-4 space-y-2"><ToggleRow label="Comments enabled" checked={data.featureSettings.commentsEnabled} onChange={(value) => setData((current) => current ? ({ ...current, featureSettings: { ...current.featureSettings, commentsEnabled: value } }) : current)} /><ToggleRow label="Contact form enabled" checked={data.featureSettings.contactsEnabled} onChange={(value) => setData((current) => current ? ({ ...current, featureSettings: { ...current.featureSettings, contactsEnabled: value } }) : current)} /><ToggleRow label="Anonymous comments" checked={data.featureSettings.allowAnonymousComments} onChange={(value) => setData((current) => current ? ({ ...current, featureSettings: { ...current.featureSettings, allowAnonymousComments: value } }) : current)} /></div><label className="mt-4 block text-xs text-white/35">Maintenance notice<textarea value={data.featureSettings.maintenanceNotice} onChange={(event) => setData((current) => current ? ({ ...current, featureSettings: { ...current.featureSettings, maintenanceNotice: event.target.value } }) : current)} maxLength={180} rows={3} className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:border-cyan-300/30" placeholder="Optional notice…" /></label><button disabled={busy === 'feature-settings'} onClick={onSaveFeatures} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-50"><Save className="h-4 w-4" /> Save interaction policy</button></section><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center gap-2"><Rocket className="h-4 w-4 text-fuchsia-300" /><h3 className="font-heading font-semibold">Public messaging</h3></div><ToggleRow label="Promo strip" checked={data.siteSettings.promoEnabled} onChange={(value) => setData((current) => current ? ({ ...current, siteSettings: { ...current.siteSettings, promoEnabled: value } }) : current)} /><label className="mt-3 block text-xs text-white/35">Promo message<textarea value={data.siteSettings.promoMessage} onChange={(event) => setData((current) => current ? ({ ...current, siteSettings: { ...current.siteSettings, promoMessage: event.target.value } }) : current)} maxLength={180} rows={3} className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:border-fuchsia-300/30" /></label><ToggleRow label="Announcement bar" checked={data.siteSettings.announcementEnabled} onChange={(value) => setData((current) => current ? ({ ...current, siteSettings: { ...current.siteSettings, announcementEnabled: value } }) : current)} /><label className="mt-3 block text-xs text-white/35">Announcement message<textarea value={data.siteSettings.announcementMessage} onChange={(event) => setData((current) => current ? ({ ...current, siteSettings: { ...current.siteSettings, announcementMessage: event.target.value } }) : current)} maxLength={180} rows={3} className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:border-fuchsia-300/30" /></label><button disabled={busy === 'site-settings'} onClick={onSaveSite} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2.5 text-xs font-bold text-fuchsia-200 disabled:opacity-50"><Save className="h-4 w-4" /> Save public messaging</button></section></div><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center justify-between"><div><h3 className="font-heading font-semibold">Category firewall</h3><p className="mt-1 text-xs text-white/35">Disable public discovery for an entire category.</p></div><span className="font-mono text-[10px] text-white/25">{data.categoryCounts.filter((item) => item.hidden).length} hidden</span></div><div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{data.categoryCounts.map((item) => <button key={item.slug} disabled={busy === `category-${item.slug}`} onClick={() => onCategoryToggle(item.slug, !item.hidden)} className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left transition ${item.hidden ? 'border-rose-300/15 bg-rose-300/5' : 'border-white/10 bg-white/[0.02] hover:border-cyan-300/15'}`}><span><span className={`block text-sm ${item.hidden ? 'text-white/35 line-through' : 'text-white/70'}`}>{item.name}</span><span className="text-[10px] text-white/25">{item.toolCount} tools</span></span>{item.hidden ? <EyeOff className="h-4 w-4 text-rose-300" /> : <Eye className="h-4 w-4 text-emerald-300" />}</button>)}</div></section></div>; }
function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-left"><span className="text-sm text-white/65">{label}</span><span className={`relative h-6 w-11 rounded-full p-1 transition ${checked ? 'bg-cyan-300/80' : 'bg-white/10'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} /></span></button>; }

function SystemPanel({ data, onRefresh, onDiagnostics }: { data: DashboardData; onRefresh: () => void; onDiagnostics: () => void }) { const env = [{ label: 'Clerk', value: data.environment.clerk }, { label: 'Redis', value: data.environment.redis }, { label: 'Gemini', value: data.environment.gemini }, { label: 'Admin email', value: data.environment.adminEmail }]; return <div className="space-y-4"><SectionHeader icon={Shield} eyebrow="System" title="Infrastructure & safeguards" description="Read-only diagnostics, safe environment readiness and operational shortcuts." /><div className="grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center gap-2"><Database className="h-4 w-4 text-cyan-300" /><h3 className="font-heading font-semibold">Redis telemetry</h3></div><div className="mt-5 flex items-end justify-between"><div><div className={`font-heading text-3xl font-bold ${data.redis.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{data.redis.ok ? 'ONLINE' : 'OFFLINE'}</div><div className="mt-1 text-xs text-white/35">Ping {data.redis.latencyMs == null ? 'unavailable' : `${data.redis.latencyMs}ms`}</div></div><Cloud className="h-10 w-10 text-cyan-300/40" /></div></section><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-300" /><h3 className="font-heading font-semibold">Environment readiness</h3></div><div className="mt-4 grid grid-cols-2 gap-2">{env.map((item) => <div key={item.label} className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="text-[10px] uppercase tracking-wider text-white/25">{item.label}</div><div className={`mt-2 text-xs font-semibold ${item.value ? 'text-emerald-300' : 'text-rose-300'}`}>{item.value ? 'READY' : 'MISSING'}</div></div>)}</div></section></div><section className="rounded-2xl border border-white/10 bg-[#090b12]/90 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-heading font-semibold">Safe admin utilities</h3><p className="mt-1 text-xs text-white/35">These actions do not expose secrets or mutate infrastructure.</p></div><div className="flex flex-wrap gap-2"><button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/55 hover:text-white"><RefreshCw className="h-3.5 w-3.5" /> Refresh telemetry</button><button onClick={onDiagnostics} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/55 hover:text-white"><Clipboard className="h-3.5 w-3.5" /> Copy diagnostics</button><a href="/nova-ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-violet-300/15 bg-violet-300/5 px-3 py-2 text-xs text-violet-200"><Sparkles className="h-3.5 w-3.5" /> Open Nova AI</a></div></div></section></div>; }

function SectionHeader({ icon: Icon, eyebrow, title, description }: { icon: typeof Settings2; eyebrow: string; title: string; description: string }) { return <div className="rounded-2xl border border-white/10 bg-[#090b12]/70 p-5"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/60"><Icon className="h-3.5 w-3.5" /> {eyebrow}</div><h2 className="mt-2 font-heading text-2xl font-bold">{title}</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-white/40">{description}</p></div>; }
function EmptyState({ icon: Icon, label }: { icon: typeof Search; label: string }) { return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-4 py-14 text-center text-sm text-white/30"><Icon className="mx-auto h-6 w-6" /><div className="mt-2">{label}</div></div>; }
