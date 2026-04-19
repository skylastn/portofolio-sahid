import { Injectable, Inject } from '@nestjs/common';
import { CATEGORY_DATABASE_REPOSITORY } from '../domain/repository/database/category_database_repository';
import type { CategoryDatabaseRepository } from '../domain/repository/database/category_database_repository';
import { CategoryEntity } from '../domain/model/entities/category_entity';
import { CategoryRequest } from '../domain/model/request/category/category_request';
import { CategoryResponse } from '../domain/model/response/category_response';
import { PaginationResponse } from '../../../shared/core/model/response/pagination_response';
import { CreateCategoryRequest } from '../domain/model/request/category/create_category_request';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_DATABASE_REPOSITORY)
    private repo: CategoryDatabaseRepository,
  ) {}

  async findAllPagination(
    request: CategoryRequest,
  ): Promise<PaginationResponse<CategoryResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return PaginationResponse.map(
      paginationEntity,
      async (u) => CategoryResponse.convertFromEntity(u)!,
    );
  }

  async findAllByListId(ids: string[]): Promise<CategoryEntity[]> {
    return await this.repo.findAllByListId(ids);
  }

  async findOneById(id: string): Promise<CategoryEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<CategoryResponse | null> {
    const category = await this.repo.findOneById(id);
    if (!FormatHelper.isPresent(category)) {
      throw new Error('Category not found');
    }
    return CategoryResponse.convertFromEntity(category);
  }

  async createOrUpdate(data: CategoryEntity): Promise<CategoryEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async createCategory(
    request: CreateCategoryRequest,
  ): Promise<CategoryEntity | null> {
    return await this.createOrUpdate(request.convertToEntity());
  }

  async updateCategory(
    id: string,
    request: CreateCategoryRequest,
  ): Promise<CategoryEntity | null> {
    const find = await this.findOneById(id);
    if (!find) {
      throw new Error('Category not found');
    }
    Object.assign(find, request);
    return await this.createOrUpdate(find);
  }
}
