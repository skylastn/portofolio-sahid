import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { WorkEntity } from '../../../../domain/model/entities/work/work_entity';
import { WorkDatabaseRepository } from '../../../../domain/repository/database/work/work_database_repository';
import { PaginationResponse } from '../../../../../../shared/core/model/response/pagination_response';
import { WorkRequest } from '../../../../domain/model/request/work/work_request';
import { paginateRepo } from '../../../../../../shared/utils/utility/pagination_utility';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';

@Injectable()
export class WorkDatabaseRepositoryImpl
  extends BaseQueryRepository<WorkEntity>
  implements WorkDatabaseRepository
{
  protected get db(): Repository<WorkEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(WorkEntity);
  }
  relations = ['portofolio'];
  constructor(
    @InjectRepository(WorkEntity)
    private readonly repo: Repository<WorkEntity>,
  ) {
    super();
  }

  async findAllPagination(
    request: WorkRequest,
  ): Promise<PaginationResponse<WorkEntity>> {
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
            companyName: search,
          }),
        },
      },
    );
  }
  async findOneById(id: string): Promise<WorkEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async createOrUpdate(data: WorkEntity): Promise<WorkEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete({ id: id });
  }
}
