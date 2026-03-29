import { Injectable, Inject } from '@nestjs/common';
import {
  CODE_LANGUAGE_DATABASE_REPOSITORY,
  CodeLanguageDatabaseRepository,
} from '../domain/repository/database/code_language_database_repository';
import { CodeLanguageRequest } from '../domain/model/request/code_language/code_language_request';
import { CodeLanguageResponse } from '../domain/model/response/code_language_response';
import { PaginationResponse } from '../../../shared/core/model/response/pagination_response';
import { CreateCodeLanguageRequest } from '../domain/model/request/code_language/create_code_language_request';
import { CodeLanguageEntity } from '../domain/model/entities/code_language_entity';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { MinioService } from '../../support/application/minio_service';
import { FileUtility } from '../../../shared/utils/utility/file_utility';
import { MinioResponse } from '../../support/domain/model/response/minio_response';

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
      (u) => CodeLanguageResponse.convertFromEntity(u)!,
    );
  }

  async findAllByListIds(ids: string[]): Promise<CodeLanguageResponse[]> {
    const contents = await this.repo.findAllByListIds(ids);
    return CodeLanguageResponse.convertListFromEntities(contents);
  }

  async findOneById(id: string): Promise<CodeLanguageEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<CodeLanguageResponse | null> {
    const content = await this.findOneById(id);
    return CodeLanguageResponse.convertFromEntity(content);
  }

  async createOrUpdate(
    data: CodeLanguageEntity,
  ): Promise<CodeLanguageEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    await this.repo.removeById(id);
  }

  async createUploadSignature(imageName: string): Promise<MinioResponse> {
    return await this.minioService.getPresignedUploadUrl(
      this.folderPath + `/${FileUtility.generateFileName(imageName)}`,
    );
  }

  async deleteMinioObject(filePath: string): Promise<void> {
    await this.minioService.removeObject(filePath);
  }

  async createCodeLanguage(
    data: CreateCodeLanguageRequest,
  ): Promise<CodeLanguageEntity | null> {
    return await this.createOrUpdate(data.convertToEntity());
  }

  async updateCodeLanguage(
    id: string,
    data: CreateCodeLanguageRequest,
  ): Promise<CodeLanguageEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('CodeLanguage not found');
    }
    Object.assign(find, data);
    const result = await this.createOrUpdate(find);
    if (
      result &&
      FormatHelper.isPresent(data.image_path) &&
      FormatHelper.isPresent(find.imagePath)
    ) {
      this.deleteMinioObject(find.imagePath);
    }
    return result;
  }
}
