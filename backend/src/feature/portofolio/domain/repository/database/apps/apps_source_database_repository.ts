import { AppsSourceEntity } from '../../../model/entities/apps/apps_source_entity';

export const APPS_SOURCE_DATABASE_REPOSITORY =
  'APPS_SOURCE_DATABASE_REPOSITORY';
export interface AppsSourceDatabaseRepository {
  findAll(portofolioId: string): Promise<AppsSourceEntity[]>;
  findOneById(id: string): Promise<AppsSourceEntity | null>;
  createOrUpdate(data: AppsSourceEntity): Promise<AppsSourceEntity | null>;
  removeById(id: number): Promise<void>;
}
