import { ThrottlerStorage } from '@nestjs/throttler';
import { Redis } from 'ioredis';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  blockDuration: number;
  throttlerName: string;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const result = await this.redis.multi().incr(key).expire(key, ttl).exec();

    if (!result || result.length === 0) {
      throw new Error('Redis operation failed');
    }

    const [err, count] = result[0];
    if (err) {
      throw err;
    }

    const totalHits = count as number;
    const isBlocked = totalHits >= limit;
    const timeToBlockExpire = isBlocked ? blockDuration : 0;

    return {
      totalHits,
      timeToExpire: ttl,
      blockDuration,
      throttlerName,
      isBlocked,
      timeToBlockExpire,
    };
  }
}
