import { PortofolioAppsSourceEntity } from '../../../model/entities/portofolio/portofolio_apps_source_entity';

export const PORTOFOLIO_APPS_SOURCE_DATABASE_REPOSITORY =
  'PORTOFOLIO_APPS_SOURCE_DATABASE_REPOSITORY';
export interface PortofolioAppsSourceDatabaseRepository {
  findAll(portofolioId: string): Promise<PortofolioAppsSourceEntity[]>;
  findAllByPortofolioIdAndListAppSourceId(
    portofolioId: string,
    listAppSourceId: string[],
  ): Promise<PortofolioAppsSourceEntity[]>;
  findOneById(id: string): Promise<PortofolioAppsSourceEntity | null>;
  createOrUpdate(data: PortofolioAppsSourceEntity): Promise<PortofolioAppsSourceEntity | null>;
  removeById(id: string): Promise<void>;
}
