import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserService } from './user_service';
import { EncryptExt } from '../../../shared/utils/extension/encrypt_ext';
import { UserResponse } from '../domain/model/response/user_response';
import { jwtConstants } from '../../../shared/constant/variable';
import type { UserEntity } from '../domain/model/entities/user_entity';
import { LoginRequest } from '../domain/model/request/user/login_request';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { BruteForceService } from '../../support/application/brute_force_service';
import { RedisService } from '../../support/application/redis_service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private bruteForceService: BruteForceService,
  ) {}

  async login(
    request: LoginRequest,
    ip: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in_seconds: number;
    user: UserResponse;
  }> {
    await this.bruteForceService.validate(ip, request.username);

    let user: UserEntity | null = null;

    if (FormatHelper.isEmail(request.username)) {
      user = await this.usersService.findByEmail(request.username);
    } else {
      user = await this.usersService.findByUsername(request.username);
    }

    if (!FormatHelper.isPresent(user)) {
      await this.bruteForceService.registerFailure(ip, request.username);
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await EncryptExt.comparePassword(
      request.password,
      user.password ?? '',
    );

    if (!validPassword) {
      await this.bruteForceService.registerFailure(ip, request.username);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.bruteForceService.clear(ip, request.username);

    const result = UserResponse.convertFromEntity(user)!;

    const accessPayload = {
      sub: user.id,
      user: result,
    };

    const tokenId = randomUUID();

    const refreshPayload = {
      sub: user.id,
      tokenId,
      type: 'refresh',
    };

    const access_token = await this.jwtService.signAsync(accessPayload, {
      secret: jwtConstants.secret,
      expiresIn: '1d',
    });

    const refresh_token = await this.jwtService.signAsync(refreshPayload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    const redisKey = `refresh_token:${user.id}:${tokenId}`;
    await this.redisService.set(redisKey, refresh_token, 60 * 60 * 24 * 7);

    return {
      access_token,
      refresh_token,
      expires_in_seconds: 60 * 60 * 24,
      user: result,
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in_seconds: number;
  }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const redisKey = `refresh_token:${payload.sub}:${payload.tokenId}`;
      const savedToken = await this.redisService.get(redisKey);

      if (!savedToken || savedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token invalid or revoked');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.redisService.del(redisKey);

      const result = UserResponse.convertFromEntity(user)!;
      const newTokenId = randomUUID();

      const newAccessPayload = {
        sub: user.id,
        user: result,
      };

      const newRefreshPayload = {
        sub: user.id,
        tokenId: newTokenId,
        type: 'refresh',
      };

      const access_token = await this.jwtService.signAsync(newAccessPayload, {
        secret: jwtConstants.secret,
        expiresIn: '1d',
      });

      const new_refresh_token = await this.jwtService.signAsync(
        newRefreshPayload,
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: '7d',
        },
      );

      const newRedisKey = `refresh_token:${user.id}:${newTokenId}`;
      await this.redisService.set(
        newRedisKey,
        new_refresh_token,
        60 * 60 * 24 * 7,
      );

      return {
        access_token,
        refresh_token: new_refresh_token,
        expires_in_seconds: 60 * 60 * 24,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const redisKey = `refresh_token:${payload.sub}:${payload.tokenId}`;
      await this.redisService.del(redisKey);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
