import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { PortofolioToolMappingEntity } from '../../../../domain/model/entities/portofolio/portofolio_tool_mapping_entity';
import { PortofolioToolMappingDatabaseRepository } from '../../../../domain/repository/database/portofolio/portofolio_tool_mapping_database_repository';

@Injectable()
export class PortofolioToolMappingDatabaseRepositoryImpl
  extends BaseQueryRepository<PortofolioToolMappingEntity>
  implements PortofolioToolMappingDatabaseRepository
{
  protected get db(): Repository<PortofolioToolMappingEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(PortofolioToolMappingEntity);
  }
  relations = ['tool'];

  constructor(
    @InjectRepository(PortofolioToolMappingEntity)
    private readonly repo: Repository<PortofolioToolMappingEntity>,
  ) {
    super();
  }

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioToolMappingEntity[]> {
    return await this.db.find({
      where: { portofolioId },
      relations: this.relations,
    });
  }

  async findAllByListIds(
    ids: string[],
  ): Promise<PortofolioToolMappingEntity[]> {
    return await this.db.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  async findAllByPortofolioIdAndListToolId(
    portofolioId: string,
    listToolId: string[],
  ): Promise<PortofolioToolMappingEntity[]> {
    return await this.db.find({
      where: { portofolioId, toolId: In(listToolId) },
      relations: this.relations,
    });
  }

  async findOneById(
    id: string,
  ): Promise<PortofolioToolMappingEntity | null> {
    return await this.db.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  async createOrUpdate(
    data: PortofolioToolMappingEntity,
  ): Promise<PortofolioToolMappingEntity | null> {
    return await this.db.save(data);
  }

  async removeById(id: string): Promise<void> {
    await this.db.delete({ id });
  }
}
