import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FrameworkService } from '../../application/framework_service';
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';
import { CreateFrameworkRequest } from '../../domain/model/request/framework/create_framework_request';
import { FrameworkRequest } from '../../domain/model/request/framework/framework_request';

@Controller('api/framework')
export class FrameworkController {
  constructor(private readonly service: FrameworkService) {}

  @Get()
  async findAllPagination(@Query() request: FrameworkRequest) {
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
  async create(@Body() request: CreateFrameworkRequest) {
    return await this.service.createFramework(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateFrameworkRequest,
  ) {
    return await this.service.updateFramework(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
