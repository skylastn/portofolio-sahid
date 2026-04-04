import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from './redis_service';

@Injectable()
export class BruteForceService {
  constructor(private readonly redisService: RedisService) {}

  private getIpFailKey(ip: string): string {
    return `bf:login:ip:${ip}`;
  }

  private getUserFailKey(username: string): string {
    return `bf:login:user:${username.toLowerCase()}`;
  }

  private getComboFailKey(ip: string, username: string): string {
    return `bf:login:combo:${ip}:${username.toLowerCase()}`;
  }

  private getIpBlockKey(ip: string): string {
    return `bf:block:ip:${ip}`;
  }

  private getComboBlockKey(ip: string, username: string): string {
    return `bf:block:combo:${ip}:${username.toLowerCase()}`;
  }

  async validate(ip: string, username: string): Promise<void> {
    const [ipBlocked, comboBlocked] = await Promise.all([
      this.redisService.exists(this.getIpBlockKey(ip)),
      this.redisService.exists(this.getComboBlockKey(ip, username)),
    ]);

    if (ipBlocked || comboBlocked) {
      throw new UnauthorizedException(
        'Too many failed attempts. Please try again later.',
      );
    }
  }

  async registerFailure(ip: string, username: string): Promise<void> {
    const ipAttempts = await this.redisService.incr(this.getIpFailKey(ip), 900);
    const userAttempts = await this.redisService.incr(
      this.getUserFailKey(username),
      900,
    );
    const comboAttempts = await this.redisService.incr(
      this.getComboFailKey(ip, username),
      900,
    );

    if (ipAttempts >= 20) {
      await this.redisService.set(this.getIpBlockKey(ip), '1', 1800);
    }

    if (comboAttempts >= 5 || userAttempts >= 10) {
      await this.redisService.set(
        this.getComboBlockKey(ip, username),
        '1',
        1800,
      );
    }
  }

  async clear(ip: string, username: string): Promise<void> {
    await Promise.all([
      this.redisService.del(this.getIpFailKey(ip)),
      this.redisService.del(this.getUserFailKey(username)),
      this.redisService.del(this.getComboFailKey(ip, username)),
      this.redisService.del(this.getComboBlockKey(ip, username)),
    ]);
  }
}
