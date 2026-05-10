import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { FrameworkEntity } from '../../model/entities/framework_entity';
import { FrameworkRequest } from '../../model/request/framework/framework_request';

export const FRAMEWORK_DATABASE_REPOSITORY = 'FRAMEWORK_DATABASE_REPOSITORY';
export interface FrameworkDatabaseRepository {
  findAllPagination(
    request: FrameworkRequest,
  ): Promise<PaginationResponse<FrameworkEntity>>;
  findAllByListIds(ids: string[]): Promise<FrameworkEntity[]>;
  findOneById(id: string): Promise<FrameworkEntity | null>;
  findAllPositioned(): Promise<FrameworkEntity[]>;
  createOrUpdate(data: FrameworkEntity): Promise<FrameworkEntity | null>;
  createOrUpdateMany(data: FrameworkEntity[]): Promise<FrameworkEntity[]>;
  removeById(id: string): Promise<void>;
}
