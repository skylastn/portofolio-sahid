import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../support/application/minio_service';
import { FrameworkEntity } from '../entities/framework_entity';

export class FrameworkResponse {
  id: string;
  codeLanguageId: string;
  title: string;
  description: string;
  imagePath: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    codeLanguageId: string,
    title: string,
    description: string,
    imagePath: string | null,
    imageUrl: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.codeLanguageId = codeLanguageId;
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: FrameworkEntity,
    // imageUrl: string | null = null,
    minioService: MinioService | null = null,
  ): Promise<FrameworkResponse> {
    return new FrameworkResponse(
      content.id,
      content.codeLanguageId,
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
      title: this.title,
      description: this.description,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): FrameworkResponse {
    return new FrameworkResponse(
      content.id,
      content.code_language_id,
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
