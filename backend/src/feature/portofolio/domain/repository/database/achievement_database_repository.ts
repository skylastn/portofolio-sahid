import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { AchievementEntity } from '../../model/entities/achievement_entity';
import { AchievementRequest } from '../../model/request/achievement/achievement_request';

export const ACHIEVEMENT_DATABASE_REPOSITORY =
  'ACHIEVEMENT_DATABASE_REPOSITORY';
export interface AchievementDatabaseRepository {
  findAllPagination(
    request: AchievementRequest,
  ): Promise<PaginationResponse<AchievementEntity>>;
  findAllByListId(ids: string[]): Promise<AchievementEntity[]>;
  findOneById(id: string): Promise<AchievementEntity | null>;
  findAllPositioned(): Promise<AchievementEntity[]>;
  createOrUpdate(data: AchievementEntity): Promise<AchievementEntity | null>;
  createOrUpdateMany(data: AchievementEntity[]): Promise<AchievementEntity[]>;
  removeById(id: string): Promise<void>;
}
