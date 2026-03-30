import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { PortofolioImageEntity } from '../../../../domain/model/entities/portofolio/portofolio_image_entity';
import { PortofolioImageDatabaseRepository } from '../../../../domain/repository/database/portofolio/portofolio_image_database_repository';

@Injectable()
export class PortofolioImageDatabaseRepositoryImpl
  extends BaseQueryRepository<PortofolioImageEntity>
  implements PortofolioImageDatabaseRepository
{
  protected get db(): Repository<PortofolioImageEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(PortofolioImageEntity);
  }
  constructor(
    @InjectRepository(PortofolioImageEntity)
    private readonly repo: Repository<PortofolioImageEntity>,
  ) {
    super();
  }

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioImageEntity[]> {
    return await this.db.find({ where: { portofolioId: portofolioId } });
  }
  async findAllByListIds(ids: string[]): Promise<PortofolioImageEntity[]> {
    return await this.db.findBy({ id: In(ids) });
  }
  async findAllByPortofolioIdAndListImagePath(
    portofolioId: string,
    listImagePath: string[],
  ): Promise<PortofolioImageEntity[]> {
    return await this.db.find({
      where: { portofolioId: portofolioId, imagePath: In(listImagePath) },
    });
  }
  async findOneById(id: string): Promise<PortofolioImageEntity | null> {
    return await this.db.findOne({ where: { id: id } });
  }
  async createOrUpdate(
    data: PortofolioImageEntity,
  ): Promise<PortofolioImageEntity | null> {
    return await this.db.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.db.delete({ id: id });
  }
}
