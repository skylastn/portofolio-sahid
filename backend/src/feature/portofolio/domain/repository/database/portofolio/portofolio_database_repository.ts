import { PaginationResponse } from '../../../../../../shared/core/model/response/pagination_response';
import { PortofolioEntity } from '../../../model/entities/portofolio/portofolio_entity';
import { PortofolioRequest } from '../../../model/request/portofolio/portofolio_request';

export const PORTOFOLIO_DATABASE_REPOSITORY = 'PORTOFOLIO_DATABASE_REPOSITORY';
export interface PortofolioDatabaseRepository {
  findAllPagination(
    request: PortofolioRequest,
  ): Promise<PaginationResponse<PortofolioEntity>>;
  findAllByListIds(ids: string[]): Promise<PortofolioEntity[]>;
  findOneById(id: string): Promise<PortofolioEntity | null>;
  findAllPositioned(): Promise<PortofolioEntity[]>;
  createOrUpdate(data: PortofolioEntity): Promise<PortofolioEntity | null>;
  createOrUpdateMany(data: PortofolioEntity[]): Promise<PortofolioEntity[]>;
  removeById(id: string): Promise<void>;
}
