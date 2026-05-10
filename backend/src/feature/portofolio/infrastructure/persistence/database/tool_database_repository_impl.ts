import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../shared/core/provider/transaction_provider';
import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { paginateRepo } from '../../../../../shared/utils/utility/pagination_utility';
import { ToolEntity } from '../../../domain/model/entities/tool_entity';
import { ToolRequest } from '../../../domain/model/request/tool/tool_request';
import { ToolDatabaseRepository } from '../../../domain/repository/database/tool_database_repository';

@Injectable()
export class ToolDatabaseRepositoryImpl
  extends BaseQueryRepository<ToolEntity>
  implements ToolDatabaseRepository
{
  constructor(
    @InjectRepository(ToolEntity)
    private readonly repo: Repository<ToolEntity>,
  ) {
    super();
  }

  protected get db(): Repository<ToolEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(ToolEntity);
  }

  async findAllPagination(
    request: ToolRequest,
  ): Promise<PaginationResponse<ToolEntity>> {
    const search = request.search?.trim();
    return await paginateRepo(
      this.db,
      { page: request.page, perPage: request.perPage },
      {
        where: {
          ...(FormatHelper.isPresent(search) && { title: search }),
        },
        order: { position: 'ASC', createdAt: 'DESC' },
      },
    );
  }

  async findAllByListIds(ids: string[]): Promise<ToolEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOneById(id: string): Promise<ToolEntity | null> {
    return await this.db.findOne({ where: { id } });
  }

  async findAllPositioned(): Promise<ToolEntity[]> {
    return await this.db.find({ order: { position: 'ASC', createdAt: 'DESC' } });
  }

  async createOrUpdate(data: ToolEntity): Promise<ToolEntity | null> {
    return await this.db.save(data);
  }

  async createOrUpdateMany(data: ToolEntity[]): Promise<ToolEntity[]> {
    return await this.db.save(data);
  }

  async removeById(id: string): Promise<void> {
    await this.db.softDelete(id);
  }
}
