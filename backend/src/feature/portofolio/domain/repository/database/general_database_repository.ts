import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { GeneralEntity } from '../../model/entities/general_entity';

export const GENERAL_DATABASE_REPOSITORY = 'GENERAL_DATABASE_REPOSITORY';
export interface GeneralDatabaseRepository {
  findAll(): Promise<GeneralEntity[]>;
  findOneById(id: string): Promise<GeneralEntity | null>;
  createOrUpdate(data: GeneralEntity): Promise<GeneralEntity | null>;
  removeById(id: string): Promise<void>;
}
