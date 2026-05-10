import { MinioService } from '../../../../../support/application/minio_service';
import type { PortofolioToolMappingEntity } from '../../entities/portofolio/portofolio_tool_mapping_entity';
import { ToolResponse } from '../tool_response';

export class PortofolioToolMappingResponse {
  id: string;
  portofolioId: string;
  toolId: string;
  tool: ToolResponse;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    portofolioId: string,
    toolId: string,
    tool: ToolResponse,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.portofolioId = portofolioId;
    this.toolId = toolId;
    this.tool = tool;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: PortofolioToolMappingEntity,
    minioService: MinioService | null = null,
  ): Promise<PortofolioToolMappingResponse> {
    return new PortofolioToolMappingResponse(
      content.id,
      content.portofolioId,
      content.toolId,
      await ToolResponse.convertFromEntity(content.tool, minioService),
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: PortofolioToolMappingEntity[],
    minioService: MinioService | null = null,
  ): Promise<PortofolioToolMappingResponse[]> {
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
      tool_id: this.toolId,
      tool: this.tool.toMap,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): PortofolioToolMappingResponse {
    return new PortofolioToolMappingResponse(
      content.id,
      content.portofolio_id,
      content.tool_id,
      ToolResponse.fromMap(content.tool),
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
