'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Monitor, Wifi, WifiOff, BatteryFull } from 'lucide-react';

interface BatteryManagerLike {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

function parseBrowser(ua: string) {
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome/') && !ua.includes('Chromium')) return 'Google Chrome';
  if (ua.includes('Firefox/')) return 'Mozilla Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown browser';
}

function parseOS(ua: string) {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
}

export function DeviceInfo() {
  const [info, setInfo] = useState<Record<string, string> | null>(null);
  const [online, setOnline] = useState(true);
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    setInfo({
      Browser: parseBrowser(ua),
      'Operating System': parseOS(ua),
      'Screen Resolution': `${window.screen.width} × ${window.screen.height}`,
      'Viewport Size': `${window.innerWidth} × ${window.innerHeight}`,
      'Pixel Ratio': String(window.devicePixelRatio),
      Language: navigator.language,
      Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Color Scheme': window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
      'Touch Support': 'ontouchstart' in window ? 'Yes' : 'No',
      'CPU Cores (reported)': String(navigator.hardwareConcurrency || 'Unknown'),
    });
    setOnline(navigator.onLine);

    function updateOnline() {
      setOnline(navigator.onLine);
    }
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManagerLike> };
    if (nav.getBattery) {
      nav.getBattery().then((b) => {
        function update() {
          setBattery({ level: b.level, charging: b.charging });
        }
        update();
        b.addEventListener('levelchange', update);
        b.addEventListener('chargingchange', update);
      });
    }

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const outputValue = info ? Object.entries(info).map(([k, v]) => `${k}: ${v}`).join('\n') : undefined;

  return (
    <ToolShell outputValue={outputValue} downloadFilename="device-info.txt" shareSlug="device-info">
      <div className="flex items-center gap-3 rounded-xl2 border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
        <Monitor className="h-5 w-5 text-primary-500" />
        <span className="font-medium">This device, right now</span>
        <span className="ml-auto flex items-center gap-1.5 text-sm">
          {online ? <Wifi className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4 text-danger" />}
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      {battery && (
        <div className="flex items-center gap-3 rounded-xl2 border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/5">
          <BatteryFull className="h-5 w-5 text-primary-500" />
          <span>{Math.round(battery.level * 100)}% battery</span>
          {battery.charging && <span className="text-xs text-success">Charging</span>}
        </div>
      )}

      {info && (
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(info).map(([label, value]) => (
            <div key={label} className="rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5">
              <div className="text-xs text-black/50 dark:text-white/50">{label}</div>
              <div className="font-medium">{value}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-black/40 dark:text-white/40">
        Everything here is read directly from your own browser — nothing is sent to a server.
      </p>
    </ToolShell>
  );
}
