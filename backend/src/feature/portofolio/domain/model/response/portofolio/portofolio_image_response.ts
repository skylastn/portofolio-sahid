import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../../support/application/minio_service';
import type { PortofolioImageEntity } from '../../entities/portofolio/portofolio_image_entity';

export class PortofolioImageResponse {
  id: string;
  portofolioId: string;
  imagePath: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    portofolioId: string,
    imagePath: string | null,
    imageUrl: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.portofolioId = portofolioId;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: PortofolioImageEntity,
    minioService: MinioService | null = null,
  ): Promise<PortofolioImageResponse> {
    return new PortofolioImageResponse(
      content.id,
      content.portofolioId,
      content.imagePath ?? null,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.imagePath)
        ? (await minioService.getPresignedViewUrl(content.imagePath)).url
        : null,
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: PortofolioImageEntity[],
    minioService: MinioService | null = null,
  ): Promise<PortofolioImageResponse[]> {
    return Promise.all(
      contents.map(
        async (content) => await this.convertFromEntity(content, minioService),
      ),
    ).then((results) => results.filter(Boolean) as PortofolioImageResponse[]);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      portofolio_id: this.portofolioId,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): PortofolioImageResponse {
    return new PortofolioImageResponse(
      content.id,
      content.portofolio_id,
      content.image_path,
      content.image_url,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
