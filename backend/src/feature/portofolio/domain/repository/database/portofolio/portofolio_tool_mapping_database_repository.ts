import { PortofolioToolMappingEntity } from '../../../model/entities/portofolio/portofolio_tool_mapping_entity';

export const PORTOFOLIO_TOOL_MAPPING_DATABASE_REPOSITORY =
  'PORTOFOLIO_TOOL_MAPPING_DATABASE_REPOSITORY';
export interface PortofolioToolMappingDatabaseRepository {
  findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioToolMappingEntity[]>;
  findAllByListIds(ids: string[]): Promise<PortofolioToolMappingEntity[]>;
  findAllByPortofolioIdAndListToolId(
    portofolioId: string,
    listToolId: string[],
  ): Promise<PortofolioToolMappingEntity[]>;
  findOneById(id: string): Promise<PortofolioToolMappingEntity | null>;
  createOrUpdate(
    data: PortofolioToolMappingEntity,
  ): Promise<PortofolioToolMappingEntity | null>;
  removeById(id: string): Promise<void>;
}
