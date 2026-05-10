import { Injectable, Inject } from '@nestjs/common';
import { PaginationResponse } from '../../../shared/core/model/response/pagination_response';
import { FileUtility } from '../../../shared/utils/utility/file_utility';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { MinioService } from '../../support/application/minio_service';
import { MinioResponse } from '../../support/domain/model/response/minio_response';
import { FrameworkEntity } from '../domain/model/entities/framework_entity';
import { CreateFrameworkRequest } from '../domain/model/request/framework/create_framework_request';
import { FRAMEWORK_DATABASE_REPOSITORY } from '../domain/repository/database/framework_database_repository';
import type { FrameworkDatabaseRepository } from '../domain/repository/database/framework_database_repository';
import { FrameworkRequest } from '../domain/model/request/framework/framework_request';
import { FrameworkResponse } from '../domain/model/response/framework_response';
import { FrameworkCodeMappingService } from './framework_code_mapping/framework_code_mapping_service';
import { syncEntityPosition } from './sortable_position_service';

@Injectable()
export class FrameworkService {
  constructor(
    @Inject(FRAMEWORK_DATABASE_REPOSITORY)
    private repo: FrameworkDatabaseRepository,
    private minioService: MinioService,
    private frameworkCodeMappingService: FrameworkCodeMappingService,
  ) {}
  folderPath = 'framework';

  async findAllPagination(
    request: FrameworkRequest,
  ): Promise<PaginationResponse<FrameworkResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return PaginationResponse.map(
      paginationEntity,
      async (u) =>
        await FrameworkResponse.convertFromEntity(u, this.minioService),
    );
  }

  async findAllByListIds(ids: string[]): Promise<FrameworkEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }

  async findOneById(id: string): Promise<FrameworkEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<FrameworkResponse | null> {
    const content = await this.findOneById(id);
    if (!FormatHelper.isPresent(content)) {
      throw new Error('Framework not found');
    }
    const codeLanguageMappings =
      await this.frameworkCodeMappingService.findAllByFrameworkId(content.id);
    return FrameworkResponse.convertFromEntity(
      content,
      this.minioService,
      codeLanguageMappings,
    );
  }

  async createOrUpdate(data: FrameworkEntity): Promise<FrameworkEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Framework not found');
    }
    await this.repo.removeById(id);
    if (FormatHelper.isPresent(find.imagePath)) {
      this.minioService.removeObject(find.imagePath);
    }
  }

  async createUploadSignature(imageName: string): Promise<MinioResponse> {
    return await this.minioService.getPresignedUploadUrl(
      this.folderPath + `/${FileUtility.generateFileName(imageName)}`,
    );
  }

  async createFramework(
    data: CreateFrameworkRequest,
  ): Promise<FrameworkEntity | null> {
    const result = await syncEntityPosition(
      this.repo,
      data.convertToEntity(),
      data.position,
    );
    if (result && FormatHelper.isNotEmpty(data.code_language_ids)) {
      await this.frameworkCodeMappingService.syncWithFrameworkIdAndListCodeLanguageId(
        result.id,
        data.code_language_ids ?? [],
        [],
      );
    }
    return result;
  }

  async updateFramework(
    id: string,
    data: CreateFrameworkRequest,
  ): Promise<FrameworkEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Framework not found');
    }
    const oldImagePath = find.imagePath;
    const entity = data.convertToEntity();
    if (data.position == null) {
      entity.position = find.position;
    }
    Object.assign(find, entity);
    const result =
      data.position == null
        ? await this.createOrUpdate(find)
        : await syncEntityPosition(this.repo, find, data.position);
    if (result) {
      await this.frameworkCodeMappingService.syncWithFrameworkIdAndListCodeLanguageId(
        result.id,
        data.code_language_ids ?? [],
        data.deleted_code_language_ids ?? [],
      );
    }
    if (
      result &&
      FormatHelper.isPresent(data.image_path) &&
      FormatHelper.isPresent(oldImagePath) &&
      data.image_path !== oldImagePath
    ) {
      this.minioService.removeObject(oldImagePath);
    }
    return result;
  }
}
