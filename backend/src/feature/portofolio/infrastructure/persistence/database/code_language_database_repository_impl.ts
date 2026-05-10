import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../shared/core/provider/transaction_provider';
import { CodeLanguageEntity } from '../../../domain/model/entities/code_language_entity';
import { CodeLanguageDatabaseRepository } from '../../../domain/repository/database/code_language_database_repository';
import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { CodeLanguageRequest } from '../../../domain/model/request/code_language/code_language_request';
import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { paginateRepo } from '../../../../../shared/utils/utility/pagination_utility';

@Injectable()
export class CodeLanguageDatabaseRepositoryImpl
  extends BaseQueryRepository<CodeLanguageEntity>
  implements CodeLanguageDatabaseRepository
{
  constructor(
    @InjectRepository(CodeLanguageEntity)
    private readonly repo: Repository<CodeLanguageEntity>,
  ) {
    super();
  }

  protected get db(): Repository<CodeLanguageEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(CodeLanguageEntity);
  }

  async findAllPagination(
    request: CodeLanguageRequest,
  ): Promise<PaginationResponse<CodeLanguageEntity>> {
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
        order: { position: 'ASC', createdAt: 'DESC' },
      },
    );
  }
  async findAllByListIds(ids: string[]): Promise<CodeLanguageEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }
  async findOneById(id: string): Promise<CodeLanguageEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async findAllPositioned(): Promise<CodeLanguageEntity[]> {
    return await this.db.find({
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }
  async createOrUpdate(
    data: CodeLanguageEntity,
  ): Promise<CodeLanguageEntity | null> {
    return await this.db.save(data);
  }
  async createOrUpdateMany(
    data: CodeLanguageEntity[],
  ): Promise<CodeLanguageEntity[]> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete(id);
  }
}
