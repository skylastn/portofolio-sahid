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

  static convertFromEntity(
    content: PortofolioToolMappingEntity,
  ): PortofolioToolMappingResponse {
    return new PortofolioToolMappingResponse(
      content.id,
      content.portofolioId,
      content.toolId,
      ToolResponse.convertFromEntity(content.tool),
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static convertListFromEntities(
    contents: PortofolioToolMappingEntity[],
  ): PortofolioToolMappingResponse[] {
    return contents.map((content) => this.convertFromEntity(content));
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
