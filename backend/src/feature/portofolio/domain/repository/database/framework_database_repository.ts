import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { FrameworkEntity } from '../../model/entities/framework_entity';

export const FRAMEWORK_DATABASE_REPOSITORY = 'FRAMEWORK_DATABASE_REPOSITORY';
export interface FrameworkDatabaseRepository {
  findAllPagination(): Promise<PaginationResponse<FrameworkEntity>>;
  findAllByListIds(ids: string[]): Promise<FrameworkEntity[]>;
  findOneById(id: string): Promise<FrameworkEntity | null>;
  createOrUpdate(data: FrameworkEntity): Promise<FrameworkEntity | null>;
  removeById(id: string): Promise<void>;
}
