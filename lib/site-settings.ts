import { redis } from '@/lib/redis';

const SITE_SETTINGS_KEY = 'novatools:site-settings';

export interface SiteSettings {
  promoEnabled: boolean;
  promoMessage: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  promoEnabled: true,
  promoMessage: 'Everything on NovaTools is free for a limited time — no sign-in required.',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const stored = await redis.get<Partial<SiteSettings>>(SITE_SETTINGS_KEY);
    return {
      promoEnabled: typeof stored?.promoEnabled === 'boolean' ? stored.promoEnabled : DEFAULT_SITE_SETTINGS.promoEnabled,
      promoMessage:
        typeof stored?.promoMessage === 'string' && stored.promoMessage.trim()
          ? stored.promoMessage.trim()
          : DEFAULT_SITE_SETTINGS.promoMessage,
    };
  } catch {
    // Keep the public site available if the optional settings store is unavailable.
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await redis.set(SITE_SETTINGS_KEY, settings);
}
