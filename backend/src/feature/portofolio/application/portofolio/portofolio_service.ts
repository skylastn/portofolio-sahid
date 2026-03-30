import { Injectable, Inject } from '@nestjs/common';
import { MinioService } from '../../../support/application/minio_service';
import {
  PORTOFOLIO_DATABASE_REPOSITORY,
  PortofolioDatabaseRepository,
} from '../../domain/repository/database/portofolio/portofolio_database_repository';
import { PortofolioImageService } from './portofolio_image_service';
import { PortofolioFrameworkMappingService } from './portofolio_framework_mapping_service';
import { PortofolioCategoryMappingService } from './portofolio_category_mapping_service';
import { PortofolioAppsSourceService } from './portofolio_apps_source_service';
import { PaginationResponse } from '../../../../shared/core/model/response/pagination_response';
import { PortofolioRequest } from '../../domain/model/request/portofolio/portofolio_request';
import { PortofolioResponse } from '../../domain/model/response/portofolio/portofolio_response';
import { PortofolioEntity } from '../../domain/model/entities/portofolio/portofolio_entity';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { CreatePortofolioRequest } from '../../domain/model/request/portofolio/create_portofolio_request';
import { FileUtility } from '../../../../shared/utils/utility/file_utility';
import { MinioResponse } from '../../../support/domain/model/response/minio_response';
import { WorkService } from '../work/work_service';

@Injectable()
export class PortofolioService {
  constructor(
    @Inject(PORTOFOLIO_DATABASE_REPOSITORY)
    private repo: PortofolioDatabaseRepository,
    private minioService: MinioService,
    private workService: WorkService,
    private portofolioImageService: PortofolioImageService,
    private portofolioAppsSourceService: PortofolioAppsSourceService,
    private portofolioFrameworkMappingService: PortofolioFrameworkMappingService,
    private portofolioCategoryMappingService: PortofolioCategoryMappingService,
  ) {}
  folderPath = 'portofolio';

  async findAllPagination(
    request: PortofolioRequest,
  ): Promise<PaginationResponse<PortofolioResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return await PaginationResponse.map(
      paginationEntity,
      async (u) => PortofolioResponse.convertFromEntity(u, this.minioService)!,
    );
  }

  async findAllByListIds(ids: string[]): Promise<PortofolioEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }

  async findOneById(id: string): Promise<PortofolioEntity | null> {
    return await this.repo.findOneById(id);
  }

  async createUploadSignature(imageName: string): Promise<MinioResponse> {
    return await this.minioService.getPresignedUploadUrl(
      this.folderPath + `/${FileUtility.generateFileName(imageName)}`,
    );
  }

  async findOneByIdResponse(id: string): Promise<PortofolioResponse | null> {
    const portofolio = await this.findOneById(id);
    if (!FormatHelper.isPresent(portofolio)) {
      throw new Error('Portofolio not found');
    }
    const appsSources = await this.portofolioAppsSourceService.findAll(id);
    const images = await this.portofolioImageService.findAllByPortofolioId(id);
    const category_mappings =
      await this.portofolioCategoryMappingService.findAllByPortofolioId(id);
    const framework_mappings =
      await this.portofolioFrameworkMappingService.findAllByPortofolioId(id);
    return PortofolioResponse.convertFromEntity(
      portofolio,
      this.minioService,
      appsSources,
      images,
      category_mappings,
      framework_mappings,
    );
  }

  async createOrUpdate(
    data: PortofolioEntity,
  ): Promise<PortofolioEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Portofolio not found');
    }
    await this.repo.removeById(id);
    if (FormatHelper.isPresent(find.thumbnailPath)) {
      this.minioService.removeObject(find.thumbnailPath);
    }
  }

  async createPortofolio(
    request: CreatePortofolioRequest,
  ): Promise<PortofolioEntity | null> {
    if (FormatHelper.isPresent(request.work_id)) {
      const work = await this.workService.findOneById(request.work_id);
      if (!FormatHelper.isPresent(work)) {
        throw new Error('Work not found');
      }
    }
    const entity = request.convertToEntity();
    const result = await this.repo.createOrUpdate(entity);
    if (FormatHelper.isPresent(result)) {
      await this.portofolioAppsSourceService.syncWithPortofolioIdAndListAppsSourceId(
        result.id,
        request.apps_sources,
        [],
      );
      await this.portofolioImageService.syncWithPortofolioIdAndListImagePath(
        result.id,
        request.images,
        [],
      );
      await this.portofolioCategoryMappingService.syncWithPortofolioIdAndListCategoryId(
        result.id,
        request.category_ids,
        [],
      );
      await this.portofolioFrameworkMappingService.syncWithPortofolioIdAndListFrameworkId(
        result.id,
        request.framework_ids,
        [],
      );
    }
    return result;
  }

  async updatePortofolio(
    id: string,
    request: CreatePortofolioRequest,
  ): Promise<PortofolioEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Portofolio not found');
    }
    if (FormatHelper.isPresent(request.work_id)) {
      const work = await this.workService.findOneById(request.work_id);
      if (!FormatHelper.isPresent(work)) {
        throw new Error('Work not found');
      }
    }
    const oldThumbnailPath = find.thumbnailPath;
    Object.assign(find, request.convertToEntity());
    const result = await this.repo.createOrUpdate(find);
    if (result) {
      if (
        FormatHelper.isPresent(request.thumbnail_path) &&
        FormatHelper.isPresent(oldThumbnailPath)
      ) {
        this.minioService.removeObject(oldThumbnailPath);
      }
      await this.portofolioAppsSourceService.syncWithPortofolioIdAndListAppsSourceId(
        result.id,
        request.apps_sources,
        request.deleted_apps_source_ids,
      );
      await this.portofolioImageService.syncWithPortofolioIdAndListImagePath(
        result.id,
        request.images,
        request.deleted_image_ids,
      );
      await this.portofolioCategoryMappingService.syncWithPortofolioIdAndListCategoryId(
        result.id,
        request.category_ids,
        request.deleted_category_ids,
      );
      await this.portofolioFrameworkMappingService.syncWithPortofolioIdAndListFrameworkId(
        result.id,
        request.framework_ids,
        request.deleted_framework_ids,
      );
    }
    return result;
  }
}
