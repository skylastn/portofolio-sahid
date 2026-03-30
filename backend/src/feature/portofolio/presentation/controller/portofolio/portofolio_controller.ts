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
import { AuthGuards } from '../../../../auth/presentation/guard/auth_guards';
import { PortofolioService } from '../../../application/portofolio/portofolio_service';
import { CreatePortofolioRequest } from '../../../domain/model/request/portofolio/create_portofolio_request';
import { PortofolioRequest } from '../../../domain/model/request/portofolio/portofolio_request';
import { PortofolioImageService } from '../../../application/portofolio/portofolio_image_service';

@Controller('api/portofolio')
export class PortofolioController {
  constructor(
    private readonly service: PortofolioService,
    private readonly portofolioImageService: PortofolioImageService,
  ) {}

  @Get()
  async findAllPagination(@Query() request: PortofolioRequest) {
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
  @Post('images/upload-signature')
  async createUploadSignatureImages(@Body() body: Record<string, any>) {
    return await this.portofolioImageService.createUploadSignature(
      body.image_name,
    );
  }

  @UseGuards(AuthGuards)
  @Post()
  async create(@Body() request: CreatePortofolioRequest) {
    return await this.service.createPortofolio(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreatePortofolioRequest,
  ) {
    return await this.service.updatePortofolio(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
