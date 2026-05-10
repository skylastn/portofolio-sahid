import type { ToolEntity } from '../entities/tool_entity';

export class ToolResponse {
  id: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string | null,
    position: number,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.position = position;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(content: ToolEntity): ToolResponse {
    return new ToolResponse(
      content.id,
      content.title,
      content.description ?? null,
      content.position ?? 0,
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static convertListFromEntities(contents: ToolEntity[]): ToolResponse[] {
    return contents.map((content) => this.convertFromEntity(content));
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
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
      content.position ?? 0,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
