import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../../../../shared/core/persistence/base_query_repository';
import { getEntityManager } from '../../../../../../shared/core/provider/transaction_provider';
import { FrameworkCodeMappingEntity } from '../../../../domain/model/entities/framework_code_mapping_entity';
import { FrameworkCodeMappingDatabaseRepository } from '../../../../domain/repository/database/framework_code_mapping/framework_code_mapping_database_repository';

@Injectable()
export class FrameworkCodeMappingDatabaseRepositoryImpl
  extends BaseQueryRepository<FrameworkCodeMappingEntity>
  implements FrameworkCodeMappingDatabaseRepository
{
  protected get db(): Repository<FrameworkCodeMappingEntity> {
    const manager = getEntityManager(this.repo.manager);
    return manager.getRepository(FrameworkCodeMappingEntity);
  }

  relations = ['codeLanguage'];

  constructor(
    @InjectRepository(FrameworkCodeMappingEntity)
    private readonly repo: Repository<FrameworkCodeMappingEntity>,
  ) {
    super();
  }

  async findAllByFrameworkId(
    frameworkId: string,
  ): Promise<FrameworkCodeMappingEntity[]> {
    return await this.db.find({
      where: { frameworkId },
      relations: this.relations,
    });
  }

  async findAllByFrameworkIdAndListCodeLanguageId(
    frameworkId: string,
    listCodeLanguageId: string[],
  ): Promise<FrameworkCodeMappingEntity[]> {
    return await this.db.find({
      where: {
        frameworkId,
        codeLanguageId: In(listCodeLanguageId),
      },
      relations: this.relations,
    });
  }

  async findOneById(id: string): Promise<FrameworkCodeMappingEntity | null> {
    return await this.db.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  async createOrUpdate(
    data: FrameworkCodeMappingEntity,
  ): Promise<FrameworkCodeMappingEntity | null> {
    return await this.db.save(data);
  }

  async removeById(id: string): Promise<void> {
    await this.db.delete({ id });
  }
}
