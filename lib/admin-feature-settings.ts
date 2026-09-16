import { redis } from '@/lib/redis';

const KEY = 'novatools:admin-feature-settings';
export interface AdminFeatureSettings {
  commentsEnabled: boolean;
  contactsEnabled: boolean;
  allowAnonymousComments: boolean;
  maintenanceNotice: string;
}
export const DEFAULT_ADMIN_FEATURES: AdminFeatureSettings = {
  commentsEnabled: true,
  contactsEnabled: true,
  allowAnonymousComments: true,
  maintenanceNotice: '',
};
export async function getAdminFeatureSettings(): Promise<AdminFeatureSettings> {
  try {
    const stored = await redis.get<Partial<AdminFeatureSettings>>(KEY);
    return { ...DEFAULT_ADMIN_FEATURES, ...(stored ?? {}) };
  } catch {
    return DEFAULT_ADMIN_FEATURES;
  }
}
export async function saveAdminFeatureSettings(settings: AdminFeatureSettings): Promise<void> {
  await redis.set(KEY, settings);
}
