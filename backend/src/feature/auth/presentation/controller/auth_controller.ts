import { AuthService } from '../../application/auth_service';
import type { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginRequest } from '../../domain/model/request/user/login_request';
import { AuthGuards } from '../guard/auth_guards';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginRequest, @Req() req: Request) {
    const ip =
      (req.ips && req.ips.length ? req.ips[0] : req.ip) || 'unknown-ip';
    return await this.authService.login(body, ip);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Body() body: Record<string, any>) {
    return await this.authService.refreshToken(body.refresh_token);
  }

  @UseGuards(AuthGuards)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() body: Record<string, any>) {
    return await this.authService.logout(body.refresh_token);
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
