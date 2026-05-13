import { AuthService } from '../../application/auth_service';
import type { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { LoginRequest } from '../../domain/model/request/user/login_request';
import type { Response } from 'express';

const REFRESH_TOKEN_COOKIE = 'refresh_token';
const REFRESH_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function isCookieSecure() {
  if (process.env.REFRESH_COOKIE_SECURE) {
    return process.env.REFRESH_COOKIE_SECURE === 'true';
  }

  return process.env.NODE_ENV === 'production' || process.env.ENV === 'production';
}

function getCookieSameSite(): 'lax' | 'strict' | 'none' {
  const value = process.env.REFRESH_COOKIE_SAME_SITE?.toLowerCase();
  if (value === 'strict' || value === 'none') return value;
  return 'lax';
}

function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: getCookieSameSite(),
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    path: '/api/auth',
  });
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: getCookieSameSite(),
    path: '/api/auth',
  });
}

function readCookie(req: Request, name: string): string | undefined {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) return undefined;

  const cookie = rawCookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) return undefined;

  return decodeURIComponent(cookie.slice(name.length + 1));
}

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip =
      (req.ips && req.ips.length ? req.ips[0] : req.ip) || 'unknown-ip';
    const result = await this.authService.login(body, ip);
    setRefreshTokenCookie(res, result.refresh_token);

    return {
      access_token: result.access_token,
      expires_in_seconds: result.expires_in_seconds,
      user: result.user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @Body() body: Record<string, any>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      readCookie(req, REFRESH_TOKEN_COOKIE) || body?.refresh_token;
    const result = await this.authService.refreshToken(refreshToken);
    setRefreshTokenCookie(res, result.refresh_token);

    return {
      access_token: result.access_token,
      expires_in_seconds: result.expires_in_seconds,
      user: result.user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Body() body: Record<string, any>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      readCookie(req, REFRESH_TOKEN_COOKIE) || body?.refresh_token;
    try {
      await this.authService.logout(refreshToken);
    } finally {
      clearRefreshTokenCookie(res);
    }
    return { success: true };
  }
  // @HttpCode(HttpStatus.OK)
  // @Post('register')
  // async register(@Body() signInDto: Record<string, any>) {
  //   const result = await this.authService.register({
  //     name: signInDto.name,
  //     username: signInDto.username,
  //     password: signInDto.password,
  //     role: signInDto.role ?? null,
  //   });
  //   return result;
  // }
}
