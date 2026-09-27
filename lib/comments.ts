import { redis, COMMENTS_KEY } from '@/lib/redis';

export interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

const MAX_NAME_LENGTH = 40;
const MAX_TEXT_LENGTH = 500;
const MAX_STORED_COMMENTS = 500;

export async function listComments(): Promise<Comment[]> {
  const raw = await redis.lrange<Comment>(COMMENTS_KEY, 0, MAX_STORED_COMMENTS - 1);
  return raw;
}

export async function addComment(name: string, text: string): Promise<Comment> {
  const cleanName = (name || 'Anonymous').trim().slice(0, MAX_NAME_LENGTH) || 'Anonymous';
  const cleanText = text.trim().slice(0, MAX_TEXT_LENGTH);
  if (!cleanText) throw new Error('Comment text is required');

  const comment: Comment = {
    id: crypto.randomUUID(),
    name: cleanName,
    text: cleanText,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(COMMENTS_KEY, comment);
  await redis.ltrim(COMMENTS_KEY, 0, MAX_STORED_COMMENTS - 1);
  return comment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const all = await redis.lrange<Comment>(COMMENTS_KEY, 0, MAX_STORED_COMMENTS - 1);
  const target = all.find((c) => c.id === id);
  if (!target) return false;
  await redis.lrem(COMMENTS_KEY, 1, target);
  return true;
}
