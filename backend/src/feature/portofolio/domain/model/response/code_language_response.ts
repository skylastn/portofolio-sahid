import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../support/application/minio_service';
import { CodeLanguageEntity } from '../entities/code_language_entity';

export class CodeLanguageResponse {
  id: string;
  title: string;
  description: string;
  imagePath: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string,
    imagePath: string | null,
    imageUrl: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: CodeLanguageEntity,
    minioService: MinioService | null = null,
  ): Promise<CodeLanguageResponse> {
    return new CodeLanguageResponse(
      content.id,
      content.title,
      content.description,
      content.imagePath,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.imagePath)
        ? (await minioService.getPresignedViewUrl(content.imagePath)).url
        : null,
      content.createdAt,
      content.updatedAt,
      content.deletedAt,
    );
  }

  static async convertListFromEntities(
    contents: CodeLanguageEntity[],
    minioService: MinioService | null = null,
  ): Promise<CodeLanguageResponse[]> {
    return Promise.all(
      contents.map(async (content) =>
        this.convertFromEntity(content, minioService),
      ),
    ).then((results) => results.filter(Boolean) as CodeLanguageResponse[]);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): CodeLanguageResponse {
    return new CodeLanguageResponse(
      content.id,
      content.title,
      content.description,
      content.image_path,
      content.image_url,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
