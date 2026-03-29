import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppsSourceDatabaseRepository } from '../../../../domain/repository/database/apps/apps_source_database_repository';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { AppsSourceEntity } from '../../../../domain/model/entities/apps/apps_source_entity';

@Injectable()
export class AppsSourceDatabaseRepositoryImpl
  extends BaseQueryRepository<AppsSourceEntity>
  implements AppsSourceDatabaseRepository
{
  constructor(
    @InjectRepository(AppsSourceEntity)
    private readonly repo: Repository<AppsSourceEntity>,
  ) {
    super();
  }

  protected get db(): Repository<AppsSourceEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(AppsSourceEntity);
  }

  async findAll(portofolioId: string): Promise<AppsSourceEntity[]> {
    return await this.db.find({ where: { portofolioId: portofolioId } });
  }
  async findOneById(id: string): Promise<AppsSourceEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async createOrUpdate(
    data: AppsSourceEntity,
  ): Promise<AppsSourceEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: number): Promise<void> {
    await this.db.delete(id);
  }
}
