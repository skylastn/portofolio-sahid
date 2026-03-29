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
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';
import { CodeLanguageService } from '../../application/code_language_service';
import { CreateCodeLanguageRequest } from '../../domain/model/request/code_language/create_code_language_request';
import { CodeLanguageRequest } from '../../domain/model/request/code_language/code_language_request';

@Controller('api/code_language')
export class CodeLanguageController {
  constructor(private readonly service: CodeLanguageService) {}

  @Get()
  async findAllPagination(@Query() request: CodeLanguageRequest) {
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
  async create(@Body() request: CreateCodeLanguageRequest) {
    return await this.service.createCodeLanguage(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateCodeLanguageRequest,
  ) {
    return await this.service.updateCodeLanguage(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
