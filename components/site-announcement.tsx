'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function SiteAnnouncement() {
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.announcementEnabled && data.announcementMessage) setMessage(data.announcementMessage);
      })
      .catch(() => undefined);
  }, []);

  if (!message || dismissed) return null;
  return (
    <div className="ect-announcement">
      <div className="ect-wrap ect-announcement__inner"><span className="ect-pulse" /><span>{message}</span><button onClick={() => setDismissed(true)} aria-label="Dismiss announcement"><X className="h-3.5 w-3.5" /></button></div>
    </div>
  );
}
