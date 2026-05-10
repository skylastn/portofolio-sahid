import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../support/application/minio_service';
import type { AchievementEntity } from '../entities/achievement_entity';

export class AchievementResponse {
  id: string;
  title: string;
  description: string;
  date: Date;
  imagePath: string | null;
  imageUrl: string | null;
  position: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string,
    date: Date,
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
    this.date = date;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.position = position;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: AchievementEntity,
    minioService: MinioService | null = null,
  ): Promise<AchievementResponse> {
    return new AchievementResponse(
      content.id,
      content.title,
      content.description,
      content.date,
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
    contents: AchievementEntity[],
    minioService: MinioService | null = null,
  ): Promise<AchievementResponse[]> {
    return Promise.all(
      contents.map(async (content) =>
        this.convertFromEntity(content, minioService),
      ),
    ).then((results) => results.filter(Boolean) as AchievementResponse[]);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      position: this.position,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): AchievementResponse {
    return new AchievementResponse(
      content.id,
      content.title,
      content.description,
      content.date,
      content.image_path,
      content.image_url,
      content.position ?? 0,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
