import { Injectable, Inject } from '@nestjs/common';
import { MinioService } from '../../../support/application/minio_service';
import {
  PORTOFOLIO_FRAMEWORK_MAPPING_DATABASE_REPOSITORY,
  PortofolioFrameworkMappingDatabaseRepository,
} from '../../domain/repository/database/portofolio/portofolio_framework_mapping_database_repository';
import { PortofolioFrameworkMappingEntity } from '../../domain/model/entities/portofolio/portofolio_framework_mapping_entity';
import { PortofolioFrameworkMappingResponse } from '../../domain/model/response/portofolio/portofolio_framework_mapping_response';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { FrameworkService } from '../framework_service';

@Injectable()
export class PortofolioFrameworkMappingService {
  constructor(
    @Inject(PORTOFOLIO_FRAMEWORK_MAPPING_DATABASE_REPOSITORY)
    private repo: PortofolioFrameworkMappingDatabaseRepository,
    private minioService: MinioService,
    private frameworkService: FrameworkService,
  ) {}

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioFrameworkMappingEntity[]> {
    return await this.repo.findAllByPortofolioId(portofolioId);
  }

  async findAllByListIds(
    ids: string[],
  ): Promise<PortofolioFrameworkMappingEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }
  async findAllByPortofolioIdAndListFrameworkId(
    portofolioId: string,
    listFrameworkId: string[],
  ): Promise<PortofolioFrameworkMappingEntity[]> {
    return await this.repo.findAllByPortofolioIdAndListFrameworkId(
      portofolioId,
      listFrameworkId,
    );
  }
  async findOneById(
    id: string,
  ): Promise<PortofolioFrameworkMappingEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(
    id: string,
  ): Promise<PortofolioFrameworkMappingResponse | null> {
    const portofolioFrameworkMapping = await this.findOneById(id);
    if (!FormatHelper.isPresent(portofolioFrameworkMapping)) {
      throw new Error('PortofolioFrameworkMapping not found');
    }
    return PortofolioFrameworkMappingResponse.convertFromEntity(
      portofolioFrameworkMapping,
      this.minioService,
    );
  }

  async createOrUpdate(
    data: PortofolioFrameworkMappingEntity,
  ): Promise<PortofolioFrameworkMappingEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async syncWithPortofolioIdAndListFrameworkId(
    portofolioId: string,
    listFrameworkId: string[],
    listDeletedFrameworkId: string[],
  ): Promise<void> {
    if (FormatHelper.isNotEmpty(listDeletedFrameworkId)) {
      await this.deleteAllByPortofolioIdAndListFrameworkId(
        portofolioId,
        listDeletedFrameworkId,
      );
    }
    if (!FormatHelper.isNotEmpty(listFrameworkId)) return;
    const existing = await this.findAllByPortofolioIdAndListFrameworkId(
      portofolioId,
      listFrameworkId,
    );

    const existingSet = new Set(existing.map((x) => x.frameworkId));

    for (const frameworkId of listFrameworkId) {
      if (existingSet.has(frameworkId)) continue;
      const find = await this.frameworkService.findOneById(frameworkId);
      if (!FormatHelper.isPresent(find)) {
        throw new Error('Framework not found');
      }
      const entity = new PortofolioFrameworkMappingEntity();
      entity.portofolioId = portofolioId;
      entity.frameworkId = frameworkId;
      await this.createOrUpdate(entity);
    }
  }

  async deleteAllByPortofolioIdAndListFrameworkId(
    portofolioId: string,
    listDeletedFrameworkId: string[],
  ): Promise<void> {
    if (!FormatHelper.isNotEmpty(listDeletedFrameworkId)) return;
    const findAll = await this.findAllByPortofolioIdAndListFrameworkId(
      portofolioId,
      listDeletedFrameworkId,
    );
    for (const content of findAll) {
      await this.removeById(content.id);
    }
  }
}
