import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../shared/core/provider/transaction_provider';
import { AchievementEntity } from '../../../domain/model/entities/achievement_entity';
import { AchievementDatabaseRepository } from '../../../domain/repository/database/achievement_database_repository';
import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { AchievementRequest } from '../../../domain/model/request/achievement/achievement_request';
import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { paginateRepo } from '../../../../../shared/utils/utility/pagination_utility';

@Injectable()
export class AchievementDatabaseRepositoryImpl
  extends BaseQueryRepository<AchievementEntity>
  implements AchievementDatabaseRepository
{
  protected get db(): Repository<AchievementEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(AchievementEntity);
  }
  constructor(
    @InjectRepository(AchievementEntity)
    private readonly repo: Repository<AchievementEntity>,
  ) {
    super();
  }

  findAllPagination(
    request: AchievementRequest,
  ): Promise<PaginationResponse<AchievementEntity>> {
    const search = request.search?.trim();
    return paginateRepo(
      this.db,
      {
        page: request.page,
        perPage: request.perPage,
      },
      {
        where: {
          ...(FormatHelper.isPresent(search) && {
            title: search,
          }),
        },
      },
    );
  }
  async findAllByListId(ids: string[]): Promise<AchievementEntity[]> {
    return await this.db.findBy({ id: In(ids) });
  }
  async findOneById(id: string): Promise<AchievementEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async createOrUpdate(
    data: AchievementEntity,
  ): Promise<AchievementEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete({ id: id });
  }
}
