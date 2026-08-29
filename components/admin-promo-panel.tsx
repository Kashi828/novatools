'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, Save } from 'lucide-react';

interface Settings {
  promoEnabled: boolean;
  promoMessage: string;
}

export function AdminPromoPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setSettings)
      .catch(() => setError('Could not load promo settings.'));
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings({ promoEnabled: data.promoEnabled, promoMessage: data.promoMessage });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save promo settings.');
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="rounded-xl2 border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Promo mode</h2>
          <p className="mt-1 max-w-xl text-sm text-black/60 dark:text-white/60">
            Turn the site-wide promotion on or off instantly. When enabled, premium tools are available without sign-in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSettings({ ...settings, promoEnabled: !settings.promoEnabled })}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${settings.promoEnabled ? 'bg-success/15 text-success' : 'bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60'}`}
          aria-pressed={settings.promoEnabled}
        >
          {settings.promoEnabled ? 'Promo on' : 'Promo off'}
        </button>
      </div>

      <label className="mt-5 block text-sm font-medium">
        Visitor message
        <textarea
          value={settings.promoMessage}
          maxLength={180}
          rows={3}
          onChange={(e) => setSettings({ ...settings, promoMessage: e.target.value })}
          className="mt-2 w-full resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary-400 dark:border-white/10 dark:bg-white/5"
        />
      </label>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : 'Save changes'}
        </button>
        <span className="text-xs text-black/45 dark:text-white/45">Changes are stored without a redeploy.</span>
      </div>
    </div>
  );
}
