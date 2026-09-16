import { redis } from '@/lib/redis';

const FLAGGED_KEY = 'novatools:flagged-comments';
const HIDDEN_KEY = 'novatools:hidden-comments';
export type CommentModerationStatus = 'visible' | 'flagged' | 'hidden';

export async function getCommentModerationIds(): Promise<{ flagged: string[]; hidden: string[] }> {
  try {
    const [flagged, hidden] = await Promise.all([redis.smembers(FLAGGED_KEY), redis.smembers(HIDDEN_KEY)]);
    return { flagged: flagged ?? [], hidden: hidden ?? [] };
  } catch { return { flagged: [], hidden: [] }; }
}

export async function setCommentModeration(id: string, status: CommentModerationStatus): Promise<void> {
  if (status === 'flagged') { await redis.sadd(FLAGGED_KEY, id); await redis.srem(HIDDEN_KEY, id); }
  else if (status === 'hidden') { await redis.sadd(HIDDEN_KEY, id); await redis.srem(FLAGGED_KEY, id); }
  else { await redis.srem(FLAGGED_KEY, id); await redis.srem(HIDDEN_KEY, id); }
}
