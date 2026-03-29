import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { CategoryEntity } from '../../model/entities/category_entity';
import { CategoryRequest } from '../../model/request/category/category_request';

export const CATEGORY_DATABASE_REPOSITORY = 'CATEGORY_DATABASE_REPOSITORY';
export interface CategoryDatabaseRepository {
  findAllPagination(
    request: CategoryRequest,
  ): Promise<PaginationResponse<CategoryEntity>>;
  findAllByListId(ids: string[]): Promise<CategoryEntity[]>;
  findOneById(id: string): Promise<CategoryEntity | null>;
  createOrUpdate(data: CategoryEntity): Promise<CategoryEntity | null>;
  removeById(id: string): Promise<void>;
}
