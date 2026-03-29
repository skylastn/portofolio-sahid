import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../shared/core/provider/transaction_provider';
import { GeneralEntity } from '../../../domain/model/entities/general_entity';
import { GeneralDatabaseRepository } from '../../../domain/repository/database/general_database_repository';

@Injectable()
export class GeneralDatabaseRepositoryImpl
  extends BaseQueryRepository<GeneralEntity>
  implements GeneralDatabaseRepository
{
  constructor(
    @InjectRepository(GeneralEntity)
    private readonly repo: Repository<GeneralEntity>,
  ) {
    super();
  }

  protected get db(): Repository<GeneralEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(GeneralEntity);
  }

  async findAll(): Promise<GeneralEntity[]> {
    return await this.repo.find();
  }
  async findOneById(id: string): Promise<GeneralEntity | null> {
    return await this.repo.findOne({ where: { id: id } });
  }
  async createOrUpdate(data: GeneralEntity): Promise<GeneralEntity | null> {
    return await this.repo.save(data);
  }
  async removeById(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
