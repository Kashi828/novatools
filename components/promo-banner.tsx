'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface PromoSettings { promoEnabled: boolean; promoMessage: string; }

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
    <div className="ect-promo-banner">
      <div className="ect-wrap ect-promo-banner__inner"><span className="ect-pulse" /><span>{settings.promoMessage}</span><button onClick={() => setDismissed(true)} aria-label="Dismiss promotion"><X className="h-3.5 w-3.5" /></button></div>
    </div>
  );
}
