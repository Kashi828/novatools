'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const AVAILABLE_ZONES = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Sao_Paulo',
  'Europe/London', 'Europe/Paris', 'Europe/Moscow', 'Africa/Cairo', 'Asia/Dubai',
  'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Tokyo',
  'Australia/Sydney', 'Pacific/Auckland',
];

export function WorldClock() {
  const [zones, setZones] = useState<string[]>(['UTC', 'Asia/Kolkata', 'America/New_York', 'Asia/Tokyo']);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  function addZone(zone: string) {
    if (!zones.includes(zone)) setZones((prev) => [...prev, zone]);
  }
  function removeZone(zone: string) {
    setZones((prev) => prev.filter((z) => z !== zone));
  }

  const outputValue = zones
    .map((z) => `${z}: ${new Intl.DateTimeFormat('en-US', { timeZone: z, hour: '2-digit', minute: '2-digit', hour12: true }).format(now)}`)
    .join(' | ');

  return (
    <ToolShell outputValue={outputValue} shareSlug="world-clock">
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_ZONES.filter((z) => !zones.includes(z)).map((z) => (
          <Button key={z} size="sm" variant="outline" onClick={() => addZone(z)}>
            + {z}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {zones.map((zone) => (
          <div key={zone} className="flex items-center justify-between rounded-xl2 border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
            <div>
              <div className="text-xs text-black/50 dark:text-white/50">{zone}</div>
              <div className="font-heading text-2xl font-semibold tabular-nums">
                {new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)}
              </div>
              <div className="text-xs text-black/40 dark:text-white/40">
                {new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' }).format(now)}
              </div>
            </div>
            <button onClick={() => removeZone(zone)} className="text-black/30 hover:text-danger dark:text-white/30">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
