import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { PortofolioFrameworkMappingEntity } from '../../../../domain/model/entities/portofolio/portofolio_framework_mapping_entity';
import { PortofolioFrameworkMappingDatabaseRepository } from '../../../../domain/repository/database/portofolio/portofolio_framework_mapping_database_repository';

@Injectable()
export class PortofolioFrameworkMappingDatabaseRepositoryImpl
  extends BaseQueryRepository<PortofolioFrameworkMappingEntity>
  implements PortofolioFrameworkMappingDatabaseRepository
{
  protected get db(): Repository<PortofolioFrameworkMappingEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(PortofolioFrameworkMappingEntity);
  }
  relations = ['framework'];
  constructor(
    @InjectRepository(PortofolioFrameworkMappingEntity)
    private readonly repo: Repository<PortofolioFrameworkMappingEntity>,
  ) {
    super();
  }

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioFrameworkMappingEntity[]> {
    return await this.db.find({
      where: { portofolioId: portofolioId },
      relations: this.relations,
    });
  }
  async findAllByListIds(
    ids: string[],
  ): Promise<PortofolioFrameworkMappingEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }
  async findAllByPortofolioIdAndListFrameworkId(
    portofolioId: string,
    listFrameworkId: string[],
  ): Promise<PortofolioFrameworkMappingEntity[]> {
    return await this.db.find({
      where: { portofolioId: portofolioId, frameworkId: In(listFrameworkId) },
      relations: this.relations,
    });
  }
  async findOneById(
    id: string,
  ): Promise<PortofolioFrameworkMappingEntity | null> {
    return await this.db.findOne({
      where: { id: id },
      relations: this.relations,
    });
  }
  async createOrUpdate(
    data: PortofolioFrameworkMappingEntity,
  ): Promise<PortofolioFrameworkMappingEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.delete({ id: id });
  }
}
