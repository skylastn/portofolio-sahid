import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../../application/category_service';
import { CategoryRequest } from '../../domain/model/request/category/category_request';
import { CreateCategoryRequest } from '../../domain/model/request/category/create_category_request';
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async findAllPagination(@Query() request: CategoryRequest) {
    return await this.service.findAllPagination(request);
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return await this.service.findOneByIdResponse(id);
  }

  @UseGuards(AuthGuards)
  @Post()
  async create(@Body() request: CreateCategoryRequest) {
    return await this.service.createCategory(request);
  }

  @UseGuards(AuthGuards)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: CreateCategoryRequest,
  ) {
    return await this.service.updateCategory(id, request);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.service.removeById(id);
  }
}
