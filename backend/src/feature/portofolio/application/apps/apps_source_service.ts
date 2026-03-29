import { Injectable, Inject } from '@nestjs/common';
import {
  APPS_SOURCE_DATABASE_REPOSITORY,
  AppsSourceDatabaseRepository,
} from '../../domain/repository/database/apps/apps_source_database_repository';
import { AppsSourceEntity } from '../../domain/model/entities/apps/apps_source_entity';

@Injectable()
export class AppsSourceService {
  constructor(
    @Inject(APPS_SOURCE_DATABASE_REPOSITORY)
    private repo: AppsSourceDatabaseRepository,
  ) {}

  async findAll(portofolioId: string): Promise<AppsSourceEntity[]> {
    return await this.repo.findAll(portofolioId);
  }

  async findOneById(id: string): Promise<AppsSourceEntity | null> {
    return await this.repo.findOneById(id);
  }

  async createOrUpdate(
    data: AppsSourceEntity,
  ): Promise<AppsSourceEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: number): Promise<void> {
    return await this.repo.removeById(id);
  }
}
