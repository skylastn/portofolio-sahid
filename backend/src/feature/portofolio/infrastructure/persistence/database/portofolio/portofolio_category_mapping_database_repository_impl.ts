import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { PortofolioCategoryMappingEntity } from '../../../../domain/model/entities/portofolio/portofolio_category_mapping_entity';
import { PortofolioCategoryMappingDatabaseRepository } from '../../../../domain/repository/database/portofolio/portofolio_category_mapping_database_repository';

@Injectable()
export class PortofolioCategoryMappingDatabaseRepositoryImpl
  extends BaseQueryRepository<PortofolioCategoryMappingEntity>
  implements PortofolioCategoryMappingDatabaseRepository
{
  protected get db(): Repository<PortofolioCategoryMappingEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(PortofolioCategoryMappingEntity);
  }
  relations = ['category'];
  constructor(
    @InjectRepository(PortofolioCategoryMappingEntity)
    private readonly repo: Repository<PortofolioCategoryMappingEntity>,
  ) {
    super();
  }

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioCategoryMappingEntity[]> {
    return await this.db.find({
      where: { portofolioId: portofolioId },
      relations: this.relations,
    });
  }
  async findAllByListIds(
    ids: string[],
  ): Promise<PortofolioCategoryMappingEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }
  async findAllByPortofolioIdAndListCategoryId(
    portofolioId: string,
    listCategoryId: string[],
  ): Promise<PortofolioCategoryMappingEntity[]> {
    return await this.db.find({
      where: { portofolioId: portofolioId, categoryId: In(listCategoryId) },
      relations: this.relations,
    });
  }
  async findOneById(
    id: string,
  ): Promise<PortofolioCategoryMappingEntity | null> {
    return await this.db.findOne({
      where: { id: id },
      relations: this.relations,
    });
  }
  async createOrUpdate(
    data: PortofolioCategoryMappingEntity,
  ): Promise<PortofolioCategoryMappingEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.delete({ id: id });
  }
}
