import { PortofolioFrameworkMappingEntity } from '../../../model/entities/portofolio/portofolio_framework_mapping_entity';

export const PORTOFOLIO_FRAMEWORK_MAPPING_DATABASE_REPOSITORY =
  'PORTOFOLIO_FRAMEWORK_MAPPING_DATABASE_REPOSITORY';
export interface PortofolioFrameworkMappingDatabaseRepository {
  findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioFrameworkMappingEntity[]>;
  findAllByPortofolioIdAndListFrameworkId(
    portofolioId: string,
    listFrameworkId: string[],
  ): Promise<PortofolioFrameworkMappingEntity[]>;
  findAllByListIds(ids: string[]): Promise<PortofolioFrameworkMappingEntity[]>;
  findOneById(id: string): Promise<PortofolioFrameworkMappingEntity | null>;
  createOrUpdate(
    data: PortofolioFrameworkMappingEntity,
  ): Promise<PortofolioFrameworkMappingEntity | null>;
  removeById(id: string): Promise<void>;
}
