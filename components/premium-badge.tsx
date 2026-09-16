'use client';

import { useEffect, useState } from 'react';

export function PremiumBadge({ slug, defaultPremium }: { slug: string; defaultPremium: boolean }) {
  const [premium, setPremium] = useState(defaultPremium);

  useEffect(() => {
    let active = true;
    fetch('/api/tool-premium', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { premiumTools?: string[] } | null) => {
        if (active && Array.isArray(payload?.premiumTools)) {
          setPremium(payload.premiumTools.includes(slug));
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [slug]);

  if (!premium) return null;
  return <span className="rounded-full bg-gradient-premium px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-glow-gold">Premium</span>;
}
