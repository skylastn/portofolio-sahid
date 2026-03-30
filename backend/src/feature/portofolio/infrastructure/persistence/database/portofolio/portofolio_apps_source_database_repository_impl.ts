import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PortofolioAppsSourceDatabaseRepository } from '../../../../domain/repository/database/portofolio/portofolio_apps_source_database_repository';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { PortofolioAppsSourceEntity } from '../../../../domain/model/entities/portofolio/portofolio_apps_source_entity';

@Injectable()
export class PortofolioAppsSourceDatabaseRepositoryImpl
  extends BaseQueryRepository<PortofolioAppsSourceEntity>
  implements PortofolioAppsSourceDatabaseRepository
{
  constructor(
    @InjectRepository(PortofolioAppsSourceEntity)
    private readonly repo: Repository<PortofolioAppsSourceEntity>,
  ) {
    super();
  }
  protected get db(): Repository<PortofolioAppsSourceEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(PortofolioAppsSourceEntity);
  }

  async findAll(portofolioId: string): Promise<PortofolioAppsSourceEntity[]> {
    return await this.db.find({ where: { portofolioId: portofolioId } });
  }
  async findAllByPortofolioIdAndListAppSourceId(
    portofolioId: string,
    listAppSourceId: string[],
  ): Promise<PortofolioAppsSourceEntity[]> {
    return await this.db.find({
      where: { portofolioId: portofolioId, id: In(listAppSourceId) },
    });
  }
  async findOneById(id: string): Promise<PortofolioAppsSourceEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async createOrUpdate(
    data: PortofolioAppsSourceEntity,
  ): Promise<PortofolioAppsSourceEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.delete(id);
  }
}
