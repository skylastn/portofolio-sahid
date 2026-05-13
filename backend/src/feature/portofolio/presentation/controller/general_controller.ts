import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GeneralService } from '../../application/general_service';
import { CreateGeneralRequest } from '../../domain/model/request/general/create_general_request';
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';

@Controller('api/general')
export class GeneralController {
  constructor(private readonly service: GeneralService) {}

  @Get()
  async findAll() {
    return await this.service.findAllResponse();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.service.findOneByIdResponse(id);
  }

  @UseGuards(AuthGuards)
  @Post('upload-signature')
  async createUploadSignature(@Body() body: Record<string, any>) {
    return await this.service.createUploadSignature(body.file_name);
  }

  @UseGuards(AuthGuards)
  @Post()
  async create(@Body() request: CreateGeneralRequest) {
    return await this.service.createGeneral(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateGeneralRequest) {
    return await this.service.updateGeneral(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
