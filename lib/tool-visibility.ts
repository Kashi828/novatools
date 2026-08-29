import { redis } from '@/lib/redis';

const HIDDEN_TOOLS_KEY = 'novatools:hidden-tools';

export async function getHiddenSlugs(): Promise<string[]> {
  const members = await redis.smembers(HIDDEN_TOOLS_KEY);
  return members ?? [];
}

export async function hideTool(slug: string): Promise<void> {
  await redis.sadd(HIDDEN_TOOLS_KEY, slug);
}

export async function showTool(slug: string): Promise<void> {
  await redis.srem(HIDDEN_TOOLS_KEY, slug);
}
