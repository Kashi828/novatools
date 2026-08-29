'use client';

import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';

export function SiteAnnouncement() {
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings').then((res) => res.ok ? res.json() : null).then((data) => {
      if (data?.announcementEnabled && data.announcementMessage) setMessage(data.announcementMessage);
    }).catch(() => undefined);
  }, []);

  if (!message || dismissed) return null;
  return <div className="relative flex items-center justify-center gap-2 border-b border-primary-400/20 bg-primary-50 px-10 py-2 text-center text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-100 sm:text-sm"><Megaphone className="h-3.5 w-3.5 shrink-0" /><span>{message}</span><button onClick={() => setDismissed(true)} aria-label="Dismiss announcement" className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full hover:bg-primary-500/15"><X className="h-3.5 w-3.5" /></button></div>;
}
