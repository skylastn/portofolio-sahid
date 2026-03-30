import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';
import { AchievementService } from '../../application/achievement_service';
import { AchievementRequest } from '../../domain/model/request/achievement/achievement_request';
import { CreateAchievementRequest } from '../../domain/model/request/achievement/create_achievement_request';

@Controller('api/achievement')
export class AchievementController {
  constructor(private readonly service: AchievementService) {}

  @Get()
  async findAllPagination(@Query() request: AchievementRequest) {
    return await this.service.findAllPagination(request);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.service.findOneByIdResponse(id);
  }

  @UseGuards(AuthGuards)
  @Post('upload-signature')
  async createUploadSignature(@Body() body: Record<string, any>) {
    return await this.service.createUploadSignature(body.image_name);
  }

  @UseGuards(AuthGuards)
  @Post()
  async create(@Body() request: CreateAchievementRequest) {
    return await this.service.createAchievement(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateAchievementRequest,
  ) {
    return await this.service.updateAchievement(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
