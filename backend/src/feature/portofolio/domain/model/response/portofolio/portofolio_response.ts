import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../../support/application/minio_service';
import { PortofolioAppsSourceEntity } from '../../entities/portofolio/portofolio_apps_source_entity';
import { PortofolioCategoryMappingEntity } from '../../entities/portofolio/portofolio_category_mapping_entity';
import { PortofolioEntity } from '../../entities/portofolio/portofolio_entity';
import { PortofolioFrameworkMappingEntity } from '../../entities/portofolio/portofolio_framework_mapping_entity';
import { PortofolioImageEntity } from '../../entities/portofolio/portofolio_image_entity';
import { PortofolioAppsSourceResponse } from './portofolio_apps_source_response';
import { PortofolioCategoryMappingResponse } from './portofolio_category_mapping_response';
import { PortofolioFrameworkMappingResponse } from './portofolio_framework_mapping_response';
import { PortofolioImageResponse } from './portofolio_image_response';

export class PortofolioResponse {
  id: string;
  title: string;
  description: string;
  thumbnailPath: string | null;
  thumbnailUrl: string | null;
  appsSources: PortofolioAppsSourceResponse[];
  images: PortofolioImageResponse[];
  category_mappings: PortofolioCategoryMappingResponse[];
  framework_mappings: PortofolioFrameworkMappingResponse[];
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string,
    thumbnailPath: string | null,
    thumbnailUrl: string | null,
    appsSources: PortofolioAppsSourceResponse[],
    images: PortofolioImageResponse[],
    category_mappings: PortofolioCategoryMappingResponse[],
    framework_mappings: PortofolioFrameworkMappingResponse[],
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnailPath = thumbnailPath;
    this.thumbnailUrl = thumbnailUrl;
    this.appsSources = appsSources;
    this.images = images;
    this.category_mappings = category_mappings;
    this.framework_mappings = framework_mappings;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: PortofolioEntity,
    minioService: MinioService | null = null,
    appsSources: PortofolioAppsSourceEntity[] = [],
    images: PortofolioImageEntity[] = [],
    category_mappings: PortofolioCategoryMappingEntity[] = [],
    framework_mappings: PortofolioFrameworkMappingEntity[] = [],
  ): Promise<PortofolioResponse> {
    return new PortofolioResponse(
      content.id,
      content.title,
      content.description,
      content.thumbnailPath,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.thumbnailPath)
        ? (await minioService.getPresignedViewUrl(content.thumbnailPath)).url
        : null,
      PortofolioAppsSourceResponse.convertListFromEntities(appsSources),
      await PortofolioImageResponse.convertListFromEntities(
        images,
        minioService,
      ),
      PortofolioCategoryMappingResponse.convertListFromEntities(
        category_mappings,
      ),
      await PortofolioFrameworkMappingResponse.convertListFromEntities(
        framework_mappings,
        minioService,
      ),
      content.createdAt,
      content.updatedAt,
      content.deletedAt,
    );
  }

  static async convertListFromEntities(
    contents: PortofolioEntity[],
    minioService: MinioService | null = null,
  ): Promise<PortofolioResponse[]> {
    return Promise.all(
      contents.map(async (content) =>
        this.convertFromEntity(content, minioService),
      ),
    ).then((results) => results.filter(Boolean) as PortofolioResponse[]);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_path: this.thumbnailPath,
      image_url: this.thumbnailUrl,
      apps_sources: (this.appsSources ?? []).map((item) => item.toMap),
      images: (this.images ?? []).map((item) => item.toMap),
      category_mappings: (this.category_mappings ?? []).map(
        (item) => item.toMap,
      ),
      framework_mappings: (this.framework_mappings ?? []).map(
        (item) => item.toMap,
      ),
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): PortofolioResponse {
    return new PortofolioResponse(
      content.id,
      content.title,
      content.description,
      content.image_path,
      content.image_url,
      (content.apps_sources ?? []).map((item: any) =>
        PortofolioAppsSourceResponse.fromMap(item),
      ),
      (content.images ?? []).map((item: any) =>
        PortofolioImageResponse.fromMap(item),
      ),
      (content.category_mappings ?? []).map((item: any) =>
        PortofolioCategoryMappingResponse.fromMap(item),
      ),
      (content.framework_mappings ?? []).map((item: any) =>
        PortofolioFrameworkMappingResponse.fromMap(item),
      ),
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
