import { PortofolioCategoryMappingEntity } from '../../../model/entities/portofolio/portofolio_category_mapping_entity';

export const PORTOFOLIO_CATEGORY_MAPPING_DATABASE_REPOSITORY =
  'PORTOFOLIO_CATEGORY_MAPPING_DATABASE_REPOSITORY';
export interface PortofolioCategoryMappingDatabaseRepository {
  findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioCategoryMappingEntity[]>;
  findAllByListIds(ids: string[]): Promise<PortofolioCategoryMappingEntity[]>;
  findAllByPortofolioIdAndListCategoryId(
    portofolioId: string,
    listCategoryId: string[],
  ): Promise<PortofolioCategoryMappingEntity[]>;
  findOneById(id: string): Promise<PortofolioCategoryMappingEntity | null>;
  createOrUpdate(
    data: PortofolioCategoryMappingEntity,
  ): Promise<PortofolioCategoryMappingEntity | null>;
  removeById(id: string): Promise<void>;
}
