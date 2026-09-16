import { redis } from '@/lib/redis';

const KEY = 'novatools:maintenance';

export interface MaintenanceSettings {
  enabled: boolean;
  startAt: string | null;
  endAt: string | null;
  message: string;
}

export const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  startAt: null,
  endAt: null,
  message: 'NovaTools is undergoing scheduled maintenance. Please check back shortly.',
};

export async function getMaintenanceSettings(): Promise<MaintenanceSettings> {
  try {
    const stored = await redis.get<Partial<MaintenanceSettings>>(KEY);
    return normalize({ ...DEFAULT_MAINTENANCE, ...(stored ?? {}) });
  } catch {
    return DEFAULT_MAINTENANCE;
  }
}

export async function saveMaintenanceSettings(settings: MaintenanceSettings): Promise<void> {
  await redis.set(KEY, normalize(settings));
}

export function isMaintenanceActive(settings: MaintenanceSettings, nowMs = Date.now()): boolean {
  if (!settings.enabled) return false;
  const start = settings.startAt ? Date.parse(settings.startAt) : null;
  const end = settings.endAt ? Date.parse(settings.endAt) : null;
  if (start != null && Number.isNaN(start)) return false;
  if (end != null && Number.isNaN(end)) return false;
  return (start == null || nowMs >= start) && (end == null || nowMs < end);
}

function normalize(settings: MaintenanceSettings): MaintenanceSettings {
  return {
    enabled: settings.enabled === true,
    startAt: typeof settings.startAt === 'string' && settings.startAt ? new Date(settings.startAt).toISOString() : null,
    endAt: typeof settings.endAt === 'string' && settings.endAt ? new Date(settings.endAt).toISOString() : null,
    message: typeof settings.message === 'string' && settings.message.trim() ? settings.message.trim().slice(0, 240) : DEFAULT_MAINTENANCE.message,
  };
}
