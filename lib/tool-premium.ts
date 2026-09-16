import { redis } from '@/lib/redis';

const PREMIUM_TOOLS_KEY = 'novatools:premium-tools';
const FREE_OVERRIDE_KEY = 'novatools:free-tool-overrides';
export const ALWAYS_FREE_TOOL_SLUGS = new Set(['batch-image-processor', 'qr-batch-generator']);

export async function getPremiumToolSlugs(): Promise<string[]> {
  try { return (await redis.smembers(PREMIUM_TOOLS_KEY)) ?? []; } catch { return []; }
}
export async function getFreeToolOverrideSlugs(): Promise<string[]> {
  try { return (await redis.smembers(FREE_OVERRIDE_KEY)) ?? []; } catch { return []; }
}
export async function getEffectivePremiumToolSlugs(toolDefs: Array<{ slug: string; premium?: boolean }>): Promise<string[]> {
  const [forcedPremium, forcedFree] = await Promise.all([getPremiumToolSlugs(), getFreeToolOverrideSlugs()]);
  const premium = new Set(forcedPremium);
  const free = new Set([...forcedFree, ...ALWAYS_FREE_TOOL_SLUGS]);
  return toolDefs.filter((tool) => !free.has(tool.slug) && (premium.has(tool.slug) || Boolean(tool.premium))).map((tool) => tool.slug);
}
export async function setToolPremium(slug: string, premium: boolean): Promise<void> {
  if (ALWAYS_FREE_TOOL_SLUGS.has(slug)) return;
  if (premium) { await redis.sadd(PREMIUM_TOOLS_KEY, slug); await redis.srem(FREE_OVERRIDE_KEY, slug); }
  else { await redis.srem(PREMIUM_TOOLS_KEY, slug); await redis.sadd(FREE_OVERRIDE_KEY, slug); }
}
