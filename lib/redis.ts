import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export const COMMENTS_KEY = 'novatools:comments';
