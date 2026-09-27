import { Redis } from '@upstash/redis';

export const NOVA_DAILY_TOKEN_LIMIT = 12_000;

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;

const memoryUsage = new Map<string, { used: number; expiresAt: number }>();

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function memoryGet(key: string) {
  const current = memoryUsage.get(key);
  if (!current || current.expiresAt <= Date.now()) {
    memoryUsage.delete(key);
    return 0;
  }
  return current.used;
}

async function getUsed(key: string) {
  if (redis) return Number((await redis.get<number>(key)) || 0);
  return memoryGet(key);
}

async function changeUsed(key: string, amount: number) {
  if (redis) {
    const value = await redis.incrby(key, amount);
    if (value === amount) await redis.expire(key, 60 * 60 * 26);
    return Number(value);
  }
  const used = Math.max(0, memoryGet(key) + amount);
  memoryUsage.set(key, { used, expiresAt: Date.now() + 60 * 60 * 26 * 1000 });
  return used;
}

export function estimateTokens(text: string, fileBytes = 0) {
  return Math.max(1, Math.ceil((text.length + fileBytes) / 4));
}

export async function reserveTokens(identifier: string, requested: number) {
  const key = `nova-ai:usage:${dayKey()}:${identifier}`;
  const used = await getUsed(key);
  if (used + requested > NOVA_DAILY_TOKEN_LIMIT) {
    return { allowed: false, used, remaining: Math.max(0, NOVA_DAILY_TOKEN_LIMIT - used), key };
  }
  const nextUsed = await changeUsed(key, requested);
  if (nextUsed > NOVA_DAILY_TOKEN_LIMIT) {
    await changeUsed(key, -requested);
    const current = await getUsed(key);
    return { allowed: false, used: current, remaining: Math.max(0, NOVA_DAILY_TOKEN_LIMIT - current), key };
  }
  return { allowed: true, used: nextUsed, remaining: Math.max(0, NOVA_DAILY_TOKEN_LIMIT - nextUsed), key };
}

export async function adjustTokens(key: string, delta: number) {
  return changeUsed(key, delta);
}

export async function getTokenUsage(identifier: string) {
  const used = await getUsed(`nova-ai:usage:${dayKey()}:${identifier}`);
  return { used, remaining: Math.max(0, NOVA_DAILY_TOKEN_LIMIT - used), limit: NOVA_DAILY_TOKEN_LIMIT };
}
