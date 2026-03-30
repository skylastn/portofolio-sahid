import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { PortofolioEntity } from '../../../../domain/model/entities/portofolio/portofolio_entity';
import { PortofolioDatabaseRepository } from '../../../../domain/repository/database/portofolio/portofolio_database_repository';
import { PaginationResponse } from '../../../../../../shared/core/model/response/pagination_response';
import { PortofolioRequest } from '../../../../domain/model/request/portofolio/portofolio_request';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { paginateRepo } from '../../../../../../shared/utils/utility/pagination_utility';

@Injectable()
export class PortofolioDatabaseRepositoryImpl
  extends BaseQueryRepository<PortofolioEntity>
  implements PortofolioDatabaseRepository
{
  protected get db(): Repository<PortofolioEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(PortofolioEntity);
  }
  relations = ['work'];
  constructor(
    @InjectRepository(PortofolioEntity)
    private readonly repo: Repository<PortofolioEntity>,
  ) {
    super();
  }

  async findAllPagination(
    request: PortofolioRequest,
  ): Promise<PaginationResponse<PortofolioEntity>> {
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
          ...(FormatHelper.isPresent(request.work_id) && {
            workId: request.work_id,
          }),
        },
        relations: this.relations,
      },
    );
  }
  async findAllByListIds(ids: string[]): Promise<PortofolioEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }
  async findOneById(id: string): Promise<PortofolioEntity | null> {
    return await this.db.findOne({
      where: { id: id },
      relations: this.relations,
    });
  }
  async createOrUpdate(
    data: PortofolioEntity,
  ): Promise<PortofolioEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete({ id: id });
  }
}
