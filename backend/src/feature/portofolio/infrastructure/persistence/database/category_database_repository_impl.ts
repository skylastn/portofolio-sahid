import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { BaseQueryRepository } from '../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../shared/core/provider/transaction_provider';
import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { paginateRepo } from '../../../../../shared/utils/utility/pagination_utility';
import { CategoryEntity } from '../../../domain/model/entities/category_entity';
import { CategoryRequest } from '../../../domain/model/request/category/category_request';
import { CategoryDatabaseRepository } from '../../../domain/repository/database/category_database_repository';

@Injectable()
export class CategoryDatabaseRepositoryImpl
  extends BaseQueryRepository<CategoryEntity>
  implements CategoryDatabaseRepository
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {
    super();
  }

  protected get db(): Repository<CategoryEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(CategoryEntity);
  }

  async findAllPagination(
    request: CategoryRequest,
  ): Promise<PaginationResponse<CategoryEntity>> {
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

  async findAllByListId(ids: string[]): Promise<CategoryEntity[]> {
    return await this.db.findBy({ id: In(ids) });
  }
  async findOneById(id: string): Promise<CategoryEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async createOrUpdate(data: CategoryEntity): Promise<CategoryEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete(id);
  }
}
