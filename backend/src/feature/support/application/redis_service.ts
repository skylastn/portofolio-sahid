import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    if (ttlInSeconds) {
      await this.client.set(key, value, { EX: ttlInSeconds });
      return;
    }
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async expire(key: string, ttlInSeconds: number): Promise<boolean> {
    const result = await this.client.expire(key, ttlInSeconds);
    return result === 1;
  }

  async incr(key: string, ttlInSeconds?: number): Promise<number> {
    const value = await this.client.incr(key);

    if (value === 1 && ttlInSeconds) {
      await this.client.expire(key, ttlInSeconds);
    }

    return value;
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }
}
