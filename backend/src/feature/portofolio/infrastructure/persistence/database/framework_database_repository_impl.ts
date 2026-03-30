import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../shared/core/provider/transaction_provider';
import { FrameworkEntity } from '../../../domain/model/entities/framework_entity';
import { FrameworkDatabaseRepository } from '../../../domain/repository/database/framework_database_repository';
import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { FrameworkRequest } from '../../../domain/model/request/framework/framework_request';
import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { paginateRepo } from '../../../../../shared/utils/utility/pagination_utility';

@Injectable()
export class FrameworkDatabaseRepositoryImpl
  extends BaseQueryRepository<FrameworkEntity>
  implements FrameworkDatabaseRepository
{
  constructor(
    @InjectRepository(FrameworkEntity)
    private readonly repo: Repository<FrameworkEntity>,
  ) {
    super();
  }

  protected get db(): Repository<FrameworkEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(FrameworkEntity);
  }

  async findAllPagination(
    request: FrameworkRequest,
  ): Promise<PaginationResponse<FrameworkEntity>> {
    const search = request.search?.trim();
    return await paginateRepo(
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
  async findAllByListIds(ids: string[]): Promise<FrameworkEntity[]> {
    return await this.db.findBy({ id: In(ids) });
  }
  async findOneById(id: string): Promise<FrameworkEntity | null> {
    return await this.db.findOneBy({ id });
  }
  async createOrUpdate(data: FrameworkEntity): Promise<FrameworkEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete(id);
  }
}
