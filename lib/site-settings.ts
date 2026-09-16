import { redis } from '@/lib/redis';

const SITE_SETTINGS_KEY = 'novatools:site-settings';

export interface SiteSettings {
  promoEnabled: boolean;
  promoMessage: string;
  announcementEnabled: boolean;
  announcementMessage: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  promoEnabled: true,
  promoMessage: 'Everything on NovaTools is free for a limited time — no sign-in required.',
  announcementEnabled: false,
  announcementMessage: 'We are improving NovaTools. Thanks for your patience.',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const stored = await redis.get<Partial<SiteSettings>>(SITE_SETTINGS_KEY);
    return {
      promoEnabled: typeof stored?.promoEnabled === 'boolean' ? stored.promoEnabled : DEFAULT_SITE_SETTINGS.promoEnabled,
      promoMessage: typeof stored?.promoMessage === 'string' && stored.promoMessage.trim() ? stored.promoMessage.trim() : DEFAULT_SITE_SETTINGS.promoMessage,
      announcementEnabled: typeof stored?.announcementEnabled === 'boolean' ? stored.announcementEnabled : DEFAULT_SITE_SETTINGS.announcementEnabled,
      announcementMessage: typeof stored?.announcementMessage === 'string' && stored.announcementMessage.trim() ? stored.announcementMessage.trim() : DEFAULT_SITE_SETTINGS.announcementMessage,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await redis.set(SITE_SETTINGS_KEY, settings);
}
