import { PaginationResponse } from '../../../../../../shared/core/model/response/pagination_response';
import { WorkEntity } from '../../../model/entities/work/work_entity';
import { WorkRequest } from '../../../model/request/work/work_request';

export const WORK_DATABASE_REPOSITORY = 'WORK_DATABASE_REPOSITORY';
export interface WorkDatabaseRepository {
  findAllPagination(
    request: WorkRequest,
  ): Promise<PaginationResponse<WorkEntity>>;
  findOneById(id: string): Promise<WorkEntity | null>;
  createOrUpdate(data: WorkEntity): Promise<WorkEntity | null>;
  removeById(id: string): Promise<void>;
}
