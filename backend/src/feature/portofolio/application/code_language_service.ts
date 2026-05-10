import { Injectable, Inject } from '@nestjs/common';
import {
  CODE_LANGUAGE_DATABASE_REPOSITORY,
} from '../domain/repository/database/code_language_database_repository';
import type { CodeLanguageDatabaseRepository } from '../domain/repository/database/code_language_database_repository';
import { CodeLanguageRequest } from '../domain/model/request/code_language/code_language_request';
import { CodeLanguageResponse } from '../domain/model/response/code_language_response';
import { PaginationResponse } from '../../../shared/core/model/response/pagination_response';
import { CreateCodeLanguageRequest } from '../domain/model/request/code_language/create_code_language_request';
import { CodeLanguageEntity } from '../domain/model/entities/code_language_entity';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { MinioService } from '../../support/application/minio_service';
import { FileUtility } from '../../../shared/utils/utility/file_utility';
import { MinioResponse } from '../../support/domain/model/response/minio_response';
import { syncEntityPosition } from './sortable_position_service';

@Injectable()
export class CodeLanguageService {
  constructor(
    @Inject(CODE_LANGUAGE_DATABASE_REPOSITORY)
    private repo: CodeLanguageDatabaseRepository,
    private minioService: MinioService,
  ) {}
  folderPath = 'code-language';

  async findAllPagination(
    request: CodeLanguageRequest,
  ): Promise<PaginationResponse<CodeLanguageResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return PaginationResponse.map(
      paginationEntity,
      async (u) =>
        await CodeLanguageResponse.convertFromEntity(u, this.minioService),
    );
  }

  async findAllByListIds(ids: string[]): Promise<CodeLanguageEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }

  async findOneById(id: string): Promise<CodeLanguageEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<CodeLanguageResponse | null> {
    const content = await this.findOneById(id);
    if (!FormatHelper.isPresent(content)) {
      throw new Error('CodeLanguage not found');
    }
    return CodeLanguageResponse.convertFromEntity(content, this.minioService);
  }

  async createOrUpdate(
    data: CodeLanguageEntity,
  ): Promise<CodeLanguageEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('CodeLanguage not found');
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

  async createCodeLanguage(
    data: CreateCodeLanguageRequest,
  ): Promise<CodeLanguageEntity | null> {
    return await syncEntityPosition(
      this.repo,
      data.convertToEntity(),
      data.position,
    );
  }

  async updateCodeLanguage(
    id: string,
    data: CreateCodeLanguageRequest,
  ): Promise<CodeLanguageEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('CodeLanguage not found');
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
