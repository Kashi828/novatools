'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface PromoSettings {
  promoEnabled: boolean;
  promoMessage: string;
}

export function PromoBanner() {
  const [settings, setSettings] = useState<PromoSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && setSettings(data))
      .catch(() => undefined);
  }, []);

  if (!settings?.promoEnabled || dismissed) return null;

  return (
    <div className="relative flex items-center justify-center gap-2 bg-gradient-brand px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <Sparkles className="h-3.5 w-3.5 shrink-0" />
      <span>{settings.promoMessage}</span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/20"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
