import { MinioService } from '../../../../../support/application/minio_service';
import { PortofolioFrameworkMappingEntity } from '../../entities/portofolio/portofolio_framework_mapping_entity';
import { FrameworkResponse } from '../framework_response';

export class PortofolioFrameworkMappingResponse {
  id: string;
  portofolioId: string;
  frameworkId: string;
  framework: FrameworkResponse;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    portofolioId: string,
    frameworkId: string,
    framework: FrameworkResponse,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.portofolioId = portofolioId;
    this.frameworkId = frameworkId;
    this.framework = framework;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: PortofolioFrameworkMappingEntity,
    minioService: MinioService | null = null,
  ): Promise<PortofolioFrameworkMappingResponse> {
    return new PortofolioFrameworkMappingResponse(
      content.id,
      content.portofolioId,
      content.frameworkId,
      await FrameworkResponse.convertFromEntity(
        content.framework,
        minioService,
      ),
      content.createdAt,
      content.updatedAt,
      content.deletedAt,
    );
  }

  static async convertListFromEntities(
    contents: PortofolioFrameworkMappingEntity[],
    minioService: MinioService | null = null,
  ): Promise<PortofolioFrameworkMappingResponse[]> {
    return await Promise.all(
      contents.map(
        async (content) => await this.convertFromEntity(content, minioService),
      ),
    );
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      portofolio_id: this.portofolioId,
      framework_id: this.frameworkId,
      framework: this.framework.toMap,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): PortofolioFrameworkMappingResponse {
    return new PortofolioFrameworkMappingResponse(
      content.id,
      content.portofolio_id,
      content.framework_id,
      FrameworkResponse.fromMap(content.framework),
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
