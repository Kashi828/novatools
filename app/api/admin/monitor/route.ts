import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { redis } from '@/lib/redis';
import { listComments } from '@/lib/comments';
import { getHiddenSlugs } from '@/lib/tool-visibility';
import { tools } from '@/data/tools';
import '@/data/ai-tools';
import '@/data/extra-tools';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const checkedAt = new Date().toISOString();
  const started = Date.now();
  let redisOk = false;
  let latencyMs: number | null = null;

  try {
    await redis.ping();
    redisOk = true;
    latencyMs = Date.now() - started;
  } catch {
    latencyMs = null;
  }

  const [comments, hiddenSlugs] = await Promise.all([listComments(), getHiddenSlugs()]);
  const categoryCounts = tools.reduce<Record<string, number>>((counts, tool) => {
    counts[tool.category] = (counts[tool.category] ?? 0) + 1;
    return counts;
  }, {});

  return NextResponse.json({
    checkedAt,
    uptime: formatUptime(process.uptime()),
    redis: { ok: redisOk, latencyMs },
    environment: {
      clerk: Boolean(process.env.CLERK_SECRET_KEY),
      redis: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      adminEmail: Boolean(process.env.ADMIN_EMAIL),
    },
    comments: comments.length,
    hiddenTools: hiddenSlugs.length,
    toolTotal: tools.length,
    categoryCounts,
  });
}

function formatUptime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
