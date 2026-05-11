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
    const workIds = request.work_ids ?? [];
    const categoryIds = request.category_id ?? [];
    const frameworkIds = request.framework_id ?? [];
    const codeLanguageIds = request.code_language_id ?? [];
    const hasRelationFilters =
      FormatHelper.isNotEmpty(categoryIds) ||
      FormatHelper.isNotEmpty(frameworkIds) ||
      FormatHelper.isNotEmpty(codeLanguageIds);
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
          ...(FormatHelper.isNotEmpty(workIds) && {
            workId: In(workIds),
          }),
        },
        relations: this.relations,
        order: { position: 'ASC', createdAt: 'DESC' },
      },
      hasRelationFilters
        ? (qb) => {
            const alias = qb.alias;
            if (FormatHelper.isNotEmpty(categoryIds)) {
              qb.andWhere(
                `EXISTS (
                  SELECT 1 FROM portofolio_category_mapping pcm
                  WHERE pcm.portofolio_id = ${alias}.id
                  AND pcm.category_id IN (:...categoryIds)
                )`,
                { categoryIds },
              );
            }
            if (FormatHelper.isNotEmpty(frameworkIds)) {
              qb.andWhere(
                `EXISTS (
                  SELECT 1 FROM portofolio_framework_mapping pfm
                  WHERE pfm.portofolio_id = ${alias}.id
                  AND pfm.framework_id IN (:...frameworkIds)
                )`,
                { frameworkIds },
              );
            }
            if (FormatHelper.isNotEmpty(codeLanguageIds)) {
              qb.andWhere(
                `EXISTS (
                  SELECT 1
                  FROM portofolio_framework_mapping pfm
                  LEFT JOIN frameworks f ON f.id = pfm.framework_id
                  LEFT JOIN framework_code_mapping fcm ON fcm.framework_id = pfm.framework_id
                  WHERE pfm.portofolio_id = ${alias}.id
                  AND (
                    f.code_language_id IN (:...codeLanguageIds)
                    OR fcm.code_language_id IN (:...codeLanguageIds)
                  )
                )`,
                { codeLanguageIds },
              );
            }
          }
        : undefined,
    );
  }
  async findAllByListIds(ids: string[]): Promise<PortofolioEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      relations: this.relations,
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }
  async findOneById(id: string): Promise<PortofolioEntity | null> {
    return await this.db.findOne({
      where: { id: id },
      relations: this.relations,
    });
  }
  async findAllPositioned(): Promise<PortofolioEntity[]> {
    return await this.db.find({
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  }
  async createOrUpdate(
    data: PortofolioEntity,
  ): Promise<PortofolioEntity | null> {
    return await this.db.save(data);
  }
  async createOrUpdateMany(
    data: PortofolioEntity[],
  ): Promise<PortofolioEntity[]> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.softDelete({ id: id });
  }
}
