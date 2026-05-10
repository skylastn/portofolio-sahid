import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../support/application/minio_service';
import type { FrameworkEntity } from '../entities/framework_entity';
import type { FrameworkCodeMappingEntity } from '../entities/framework_code_mapping_entity';
import { FrameworkCodeMappingResponse } from './framework_code_mapping/framework_code_mapping_response';
import { CodeLanguageResponse } from './code_language_response';

export class FrameworkResponse {
  id: string;
  codeLanguageId: string;
  codeLanguage: CodeLanguageResponse | null;
  title: string;
  description: string;
  imagePath: string | null;
  imageUrl: string | null;
  position: number;
  codeLanguageMappings: FrameworkCodeMappingResponse[];
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    codeLanguageId: string,
    codeLanguage: CodeLanguageResponse | null,
    title: string,
    description: string,
    imagePath: string | null,
    imageUrl: string | null,
    position: number,
    codeLanguageMappings: FrameworkCodeMappingResponse[],
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.codeLanguageId = codeLanguageId;
    this.codeLanguage = codeLanguage;
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.position = position;
    this.codeLanguageMappings = codeLanguageMappings;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: FrameworkEntity,
    // imageUrl: string | null = null,
    minioService: MinioService | null = null,
    codeLanguageMappings: FrameworkCodeMappingEntity[] = content.codeLanguageMappings ??
      [],
  ): Promise<FrameworkResponse> {
    return new FrameworkResponse(
      content.id,
      content.codeLanguageId,
      FormatHelper.isPresent(content.codeLanguage)
        ? await CodeLanguageResponse.convertFromEntity(
            content.codeLanguage,
            minioService,
          )
        : null,
      content.title,
      content.description,
      content.imagePath ?? null,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.imagePath)
        ? (await minioService.getPresignedViewUrl(content.imagePath)).url
        : null,
      content.position ?? 0,
      await FrameworkCodeMappingResponse.convertListFromEntities(
        codeLanguageMappings,
        minioService,
      ),
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: FrameworkEntity[],
    minioService: MinioService | null = null,
  ): Promise<FrameworkResponse[]> {
    return await Promise.all(
      contents.map(
        async (content) => await this.convertFromEntity(content, minioService),
      ),
    );
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      code_language_id: this.codeLanguageId,
      code_language: this.codeLanguage?.toMap ?? null,
      title: this.title,
      description: this.description,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      position: this.position,
      code_language_mappings: (this.codeLanguageMappings ?? []).map(
        (item) => item.toMap,
      ),
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): FrameworkResponse {
    return new FrameworkResponse(
      content.id,
      content.code_language_id,
      FormatHelper.isPresent(content.code_language)
        ? CodeLanguageResponse.fromMap(content.code_language)
        : null,
      content.title,
      content.description,
      content.image_path,
      content.image_url,
      content.position ?? 0,
      (content.code_language_mappings ?? []).map((item) =>
        FrameworkCodeMappingResponse.fromMap(item),
      ),
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
