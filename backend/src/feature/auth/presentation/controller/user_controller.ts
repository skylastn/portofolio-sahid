import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/user_service';
import { UserResponse } from '../../domain/model/response/user_response';
import { AuthGuards } from '../guard/auth_guards';
import { CreateUserRequest } from '../../domain/model/request/user/create_user_request';

@UseGuards(AuthGuards)
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAll() {
    return await this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  async me() {
    const result = this.userService.findMe();
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return await this.userService.findByIdResponse(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('update/:id')
  async update(@Param('id') id: string, @Body() request: CreateUserRequest) {
    const result = await this.userService.updateUser(id, request);
    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('update/self/:id')
  async updateSelf(@Body() request: CreateUserRequest) {
    const user: UserResponse | null = this.userService.findMe();
    if (!user || !user.id) {
      throw new Error('User not found');
    }
    const result = await this.userService.updateUser(user.id, request);
    return result;
  }
}
