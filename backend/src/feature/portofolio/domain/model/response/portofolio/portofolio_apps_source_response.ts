import { MinioService } from '../../../../../support/application/minio_service';
import { PortofolioAppsSourceEntity } from '../../entities/portofolio/portofolio_apps_source_entity';
import { AppSourceType } from '../../enum/apps_source_type';

export class PortofolioAppsSourceResponse {
  id: string;
  portofolioId: string;
  url: string;
  type: AppSourceType;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    portofolioId: string,
    url: string,
    type: AppSourceType,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.portofolioId = portofolioId;
    this.url = url;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(content: PortofolioAppsSourceEntity): PortofolioAppsSourceResponse {
    return new PortofolioAppsSourceResponse(
      content.id,
      content.portofolioId,
      content.url,
      content.type,
      content.createdAt,
      content.updatedAt,
      content.deletedAt,
    );
  }

  static convertListFromEntities(
    contents: PortofolioAppsSourceEntity[],
  ): PortofolioAppsSourceResponse[] {
    return contents.map((content) => this.convertFromEntity(content)!);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      portofolio_id: this.portofolioId,
      url: this.url,
      type: this.type,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): PortofolioAppsSourceResponse {
    return new PortofolioAppsSourceResponse(
      content.id,
      content.portofolio_id,
      content.url,
      content.type,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
