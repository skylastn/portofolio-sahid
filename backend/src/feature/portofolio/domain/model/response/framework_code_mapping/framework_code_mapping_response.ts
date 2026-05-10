import type { FrameworkCodeMappingEntity } from '../../entities/framework_code_mapping_entity';
import { CodeLanguageResponse } from '../code_language_response';
import { MinioService } from '../../../../../support/application/minio_service';

export class FrameworkCodeMappingResponse {
  id: string;
  frameworkId: string;
  codeLanguageId: string;
  codeLanguage: CodeLanguageResponse;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    frameworkId: string,
    codeLanguageId: string,
    codeLanguage: CodeLanguageResponse,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.frameworkId = frameworkId;
    this.codeLanguageId = codeLanguageId;
    this.codeLanguage = codeLanguage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: FrameworkCodeMappingEntity,
    minioService: MinioService | null = null,
  ): Promise<FrameworkCodeMappingResponse> {
    return new FrameworkCodeMappingResponse(
      content.id,
      content.frameworkId,
      content.codeLanguageId,
      await CodeLanguageResponse.convertFromEntity(
        content.codeLanguage,
        minioService,
      ),
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: FrameworkCodeMappingEntity[],
    minioService: MinioService | null = null,
  ): Promise<FrameworkCodeMappingResponse[]> {
    return await Promise.all(
      contents.map(
        async (content) => await this.convertFromEntity(content, minioService),
      ),
    );
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      framework_id: this.frameworkId,
      code_language_id: this.codeLanguageId,
      code_language: this.codeLanguage.toMap,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): FrameworkCodeMappingResponse {
    return new FrameworkCodeMappingResponse(
      content.id,
      content.framework_id,
      content.code_language_id,
      CodeLanguageResponse.fromMap(content.code_language),
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
