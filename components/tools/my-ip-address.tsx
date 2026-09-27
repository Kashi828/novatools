'use client';

import { useEffect, useState } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface IpInfo {
  ip: string;
}

export function MyIpAddress() {
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchIp() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (!res.ok) throw new Error('Request failed');
      const json = await res.json();
      setInfo(json);
    } catch {
      setError('Could not fetch your IP address right now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIp();
  }, []);

  return (
    <ToolShell outputValue={info?.ip} shareSlug="my-ip-address">
      <div className="flex flex-col items-center gap-4 rounded-xl2 border border-black/10 bg-black/[0.02] p-10 text-center dark:border-white/10 dark:bg-white/5">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        ) : error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : (
          <p className="font-heading text-3xl font-bold tracking-wide sm:text-4xl">{info?.ip}</p>
        )}
        <Button size="sm" variant="outline" onClick={fetchIp}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      <p className="text-xs text-black/40 dark:text-white/40">
        This is your public IP address as seen by websites you visit — it comes from a free lookup service (ipify.org), not from NovaTools itself.
      </p>
    </ToolShell>
  );
}
