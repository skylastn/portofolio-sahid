import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { ToolEntity } from '../../model/entities/tool_entity';
import { ToolRequest } from '../../model/request/tool/tool_request';

export const TOOL_DATABASE_REPOSITORY = 'TOOL_DATABASE_REPOSITORY';
export interface ToolDatabaseRepository {
  findAllPagination(request: ToolRequest): Promise<PaginationResponse<ToolEntity>>;
  findAllByListIds(ids: string[]): Promise<ToolEntity[]>;
  findOneById(id: string): Promise<ToolEntity | null>;
  findAllPositioned(): Promise<ToolEntity[]>;
  createOrUpdate(data: ToolEntity): Promise<ToolEntity | null>;
  createOrUpdateMany(data: ToolEntity[]): Promise<ToolEntity[]>;
  removeById(id: string): Promise<void>;
}
