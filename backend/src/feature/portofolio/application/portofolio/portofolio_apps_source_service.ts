import { Injectable, Inject } from '@nestjs/common';
import {
  PORTOFOLIO_APPS_SOURCE_DATABASE_REPOSITORY,
} from '../../domain/repository/database/portofolio/portofolio_apps_source_database_repository';
import type { PortofolioAppsSourceDatabaseRepository } from '../../domain/repository/database/portofolio/portofolio_apps_source_database_repository';
import { PortofolioAppsSourceEntity } from '../../domain/model/entities/portofolio/portofolio_apps_source_entity';
import { PortofolioAppsSourceResponse } from '../../domain/model/response/portofolio/portofolio_apps_source_response';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { CreatePortofolioAppsSourceRequest } from '../../domain/model/request/portofolio/apps_source/create_portofolio_apps_source_request';

@Injectable()
export class PortofolioAppsSourceService {
  constructor(
    @Inject(PORTOFOLIO_APPS_SOURCE_DATABASE_REPOSITORY)
    private repo: PortofolioAppsSourceDatabaseRepository,
  ) {}

  async findAll(portofolioId: string): Promise<PortofolioAppsSourceEntity[]> {
    return await this.repo.findAll(portofolioId);
  }
  async findAllByPortofolioIdAndListAppSourceId(
    portofolioId: string,
    listAppSourceId: string[],
  ): Promise<PortofolioAppsSourceEntity[]> {
    return await this.repo.findAllByPortofolioIdAndListAppSourceId(
      portofolioId,
      listAppSourceId,
    );
  }
  async findOneById(id: string): Promise<PortofolioAppsSourceEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<PortofolioAppsSourceResponse> {
    const content = await this.findOneById(id);
    if (!FormatHelper.isPresent(content)) {
      throw new Error('AppsSource not found');
    }
    return PortofolioAppsSourceResponse.convertFromEntity(content);
  }

  async createOrUpdate(
    data: PortofolioAppsSourceEntity,
  ): Promise<PortofolioAppsSourceEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async syncWithPortofolioIdAndListAppsSourceId(
    portofolioId: string,
    listCreatedAppsSource: CreatePortofolioAppsSourceRequest[],
    listDeletedAppsSourceId: string[],
  ): Promise<void> {
    if (FormatHelper.isNotEmpty(listDeletedAppsSourceId)) {
      await this.deleteAllByPortofolioIdAndListAppsSourceId(
        portofolioId,
        listDeletedAppsSourceId,
      );
    }
    if (!FormatHelper.isNotEmpty(listCreatedAppsSource)) return;

    for (const content of listCreatedAppsSource) {
      if (FormatHelper.isPresent(content.id)) {
        const find = await this.findOneById(content.id);
        if (!FormatHelper.isPresent(find)) {
          throw new Error('AppsSource not found');
        }
        Object.assign(find, content.convertToEntity());
        await this.createOrUpdate(find);
        continue;
      }
      const entity = content.convertToEntity();
      entity.portofolioId = portofolioId;
      await this.createOrUpdate(entity);
    }
  }

  async deleteAllByPortofolioIdAndListAppsSourceId(
    portofolioId: string,
    listDeletedAppsSourceId: string[],
  ): Promise<void> {
    if (!FormatHelper.isNotEmpty(listDeletedAppsSourceId)) return;
    const findAll = await this.findAllByPortofolioIdAndListAppSourceId(
      portofolioId,
      listDeletedAppsSourceId,
    );
    for (const content of findAll) {
      await this.removeById(content.id);
    }
  }
}
