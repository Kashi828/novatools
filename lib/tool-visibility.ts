import { redis } from '@/lib/redis';

const HIDDEN_TOOLS_KEY = 'novatools:hidden-tools';

export async function getHiddenSlugs(): Promise<string[]> {
  try {
    const members = await redis.smembers(HIDDEN_TOOLS_KEY);
    return members ?? [];
  } catch {
    // Visibility is an optional admin feature. Redis failure must not take down public pages.
    return [];
  }
}

export async function hideTool(slug: string): Promise<void> {
  await redis.sadd(HIDDEN_TOOLS_KEY, slug);
}

export async function showTool(slug: string): Promise<void> {
  await redis.srem(HIDDEN_TOOLS_KEY, slug);
}
