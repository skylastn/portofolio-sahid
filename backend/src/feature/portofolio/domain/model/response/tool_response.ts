import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../support/application/minio_service';
import type { ToolEntity } from '../entities/tool_entity';

export class ToolResponse {
  id: string;
  title: string;
  description: string | null;
  imagePath: string | null;
  imageUrl: string | null;
  position: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string | null,
    imagePath: string | null,
    imageUrl: string | null,
    position: number,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.position = position;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: ToolEntity,
    minioService: MinioService | null = null,
  ): Promise<ToolResponse> {
    return new ToolResponse(
      content.id,
      content.title,
      content.description ?? null,
      content.imagePath ?? null,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.imagePath)
        ? (await minioService.getPresignedViewUrl(content.imagePath)).url
        : null,
      content.position ?? 0,
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: ToolEntity[],
    minioService: MinioService | null = null,
  ): Promise<ToolResponse[]> {
    return await Promise.all(
      contents.map(
        async (content) => await this.convertFromEntity(content, minioService),
      ),
    );
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      position: this.position,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): ToolResponse {
    return new ToolResponse(
      content.id,
      content.title,
      content.description,
      content.image_path,
      content.image_url,
      content.position ?? 0,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
