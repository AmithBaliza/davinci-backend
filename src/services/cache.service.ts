import Redis from "ioredis";
import { env } from "../config/environment";
import logger from "../config/logger";

class CacheService {
  private redis: Redis;
  private readonly DEFAULT_TTL = 3600; // 1 hour

  constructor() {
    this.redis = new Redis(env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    this.redis.on("error", (error) => {
      logger.error("Redis connection error:", error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(
    key: string,
    value: any,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error(`Cache pattern invalidation error for ${pattern}:`, error);
    }
  }

  // Cache decorator for service methods
  withCache<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<T> {
    return this.get<T>(key).then(async (cached) => {
      if (cached !== null) {
        return cached;
      }

      const result = await fn();
      await this.set(key, result, ttl);
      return result;
    });
  }
}

export const cacheService = new CacheService();
export default cacheService;
