import { PaginationResponse } from '../../../../../../shared/core/model/response/pagination_response';
import { PortofolioEntity } from '../../../model/entities/portofolio/portofolio_entity';
import { PortofolioImageEntity } from '../../../model/entities/portofolio/portofolio_image_entity';
import { PortofolioRequest } from '../../../model/request/portofolio/portofolio_request';

export const PORTOFOLIO_IMAGE_DATABASE_REPOSITORY =
  'PORTOFOLIO_IMAGE_DATABASE_REPOSITORY';
export interface PortofolioImageDatabaseRepository {
  findAllByPortofolioId(portofolioId: string): Promise<PortofolioImageEntity[]>;
  findAllByPortofolioIdAndListImagePath(
    portofolioId: string,
    listImagePath: string[],
  ): Promise<PortofolioImageEntity[]>;
  findAllByListIds(ids: string[]): Promise<PortofolioImageEntity[]>;
  findOneById(id: string): Promise<PortofolioImageEntity | null>;
  createOrUpdate(
    data: PortofolioImageEntity,
  ): Promise<PortofolioImageEntity | null>;
  removeById(id: string): Promise<void>;
}
