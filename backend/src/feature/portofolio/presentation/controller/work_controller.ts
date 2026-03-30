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
import { WorkService } from '../../application/work/work_service';
import { CreateWorkRequest } from '../../domain/model/request/work/create_work_request';
import { WorkRequest } from '../../domain/model/request/work/work_request';

@Controller('api/work')
export class WorkController {
  constructor(private readonly service: WorkService) {}

  @Get()
  async findAllPagination(@Query() request: WorkRequest) {
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
  async create(@Body() request: CreateWorkRequest) {
    return await this.service.createWork(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateWorkRequest) {
    return await this.service.updateWork(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
