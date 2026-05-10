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
import { ToolService } from '../../application/tool_service';
import { CreateToolRequest } from '../../domain/model/request/tool/create_tool_request';
import { ToolRequest } from '../../domain/model/request/tool/tool_request';
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';

@Controller('api/tool')
export class ToolController {
  constructor(private readonly service: ToolService) {}

  @Get()
  async findAllPagination(@Query() request: ToolRequest) {
    return await this.service.findAllPagination(request);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.service.findOneByIdResponse(id);
  }

  @UseGuards(AuthGuards)
  @Post('upload-signature')
  async createUploadSignature(@Body() body: Record<string, any>) {
    return await this.service.createUploadSignature(body.image_name);
  }

  @UseGuards(AuthGuards)
  @Post()
  async create(@Body() request: CreateToolRequest) {
    return await this.service.createTool(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateToolRequest) {
    return await this.service.updateTool(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
