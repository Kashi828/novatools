import { redis } from '@/lib/redis';

const HIDDEN_CATEGORIES_KEY = 'novatools:hidden-categories';

export async function getHiddenCategorySlugs(): Promise<string[]> {
  try {
    const members = await redis.smembers(HIDDEN_CATEGORIES_KEY);
    return members ?? [];
  } catch {
    return [];
  }
}

export async function hideCategory(slug: string): Promise<void> {
  await redis.sadd(HIDDEN_CATEGORIES_KEY, slug);
}

export async function showCategory(slug: string): Promise<void> {
  await redis.srem(HIDDEN_CATEGORIES_KEY, slug);
}
