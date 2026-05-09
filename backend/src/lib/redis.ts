import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

const redis = redisUrl ? new Redis(redisUrl) : null;

if (!redis) {
  console.warn('REDIS_URL not provided. Caching will be disabled.');
}

export default redis;

export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis Get Error:', err);
    return null;
  }
}

export async function setCachedData(key: string, data: any, ttl: number = 3600): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err) {
    console.error('Redis Set Error:', err);
  }
}
