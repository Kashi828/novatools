'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, Clock3, Database, RefreshCw, Server, ShieldCheck, UsersRound } from 'lucide-react';
import { tools } from '@/data/tools';

interface MonitorData {
  checkedAt: string;
  uptime: string;
  redis: { ok: boolean; latencyMs: number | null };
  environment: { clerk: boolean; redis: boolean; gemini: boolean; adminEmail: boolean };
  comments: number;
  hiddenTools: number;
  toolTotal: number;
  categoryCounts: Record<string, number>;
}

export function AdminMonitorPanel() {
  const [data, setData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/monitor', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load monitoring data.');
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load monitoring data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  const categories = useMemo(() => Object.entries(data?.categoryCounts ?? {}).sort((a, b) => b[1] - a[1]), [data]);
  const checks = data ? [
    ['Clerk auth', data.environment.clerk],
    ['Upstash Redis', data.environment.redis],
    ['Gemini AI', data.environment.gemini],
    ['Admin email', data.environment.adminEmail],
  ] as const : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><Activity className="h-4 w-4 text-primary-500" /> Live site monitoring</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">Operational health and catalogue metrics. Secrets and private credentials are never displayed.</p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={loading} className="nova-control inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh monitor
        </button>
      </div>

      {error && <div className="rounded-xl2 border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{error}</div>}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={Server} label="Application" value="Online" tone="success" />
            <Metric icon={Database} label="Redis" value={data.redis.ok ? `${data.redis.latencyMs ?? '—'} ms` : 'Offline'} tone={data.redis.ok ? 'success' : 'danger'} />
            <Metric icon={UsersRound} label="Comments" value={String(data.comments)} />
            <Metric icon={ShieldCheck} label="Hidden tools" value={String(data.hiddenTools)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <section className="nova-surface rounded-xl2 p-5">
              <div className="flex items-center justify-between gap-3"><h3 className="font-heading font-semibold">Environment readiness</h3><span className="text-xs text-black/45 dark:text-white/45">No secrets exposed</span></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {checks.map(([label, ok]) => <div key={label} className="flex items-center gap-3 rounded-lg border border-black/10 bg-black/[.02] px-3 py-2.5 dark:border-white/10 dark:bg-white/5"><span className={ok ? 'text-success' : 'text-warning'}>{ok ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}</span><span className="text-sm">{label}</span><span className="ml-auto text-xs text-black/45 dark:text-white/45">{ok ? 'Ready' : 'Missing'}</span></div>)}
              </div>
            </section>

            <section className="nova-surface rounded-xl2 p-5">
              <div className="flex items-center justify-between gap-3"><h3 className="font-heading font-semibold">Catalogue health</h3><span className="text-xs text-black/45 dark:text-white/45">{data.toolTotal} registered</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="nova-surface-muted rounded-lg p-3"><div className="text-lg font-bold">{tools.filter((tool) => tool.component).length}</div><div className="text-xs nova-muted">Functional</div></div>
                <div className="nova-surface-muted rounded-lg p-3"><div className="text-lg font-bold">{tools.filter((tool) => tool.premium).length}</div><div className="text-xs nova-muted">Premium flags</div></div>
              </div>
            </section>
          </div>

          <section className="nova-surface rounded-xl2 p-5">
            <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary-500" /><h3 className="font-heading font-semibold">Category distribution</h3></div>
            <div className="mt-4 space-y-2">
              {categories.map(([name, count]) => <div key={name} className="flex items-center gap-3"><div className="w-28 shrink-0 text-xs capitalize nova-muted">{name}</div><div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10"><div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.max(4, Math.round((count / Math.max(1, data.toolTotal)) * 100))}%` }} /></div><div className="w-8 text-right text-xs font-semibold">{count}</div></div>)}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs nova-muted"><span>Monitor checked {new Date(data.checkedAt).toLocaleString()}</span><span>Server uptime: {data.uptime}</span></div>
        </>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = 'default' }: { icon: typeof Activity; label: string; value: string; tone?: 'default' | 'success' | 'danger' }) {
  const toneClass = tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : 'text-primary-500';
  return <div className="nova-surface rounded-xl2 p-4"><div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 ${toneClass}`}><Icon className="h-4 w-4" /></div><div className="mt-3 text-xs nova-muted">{label}</div><div className={`mt-0.5 font-heading text-lg font-bold ${toneClass}`}>{value}</div></div>;
}
