import type { CategoryEntity } from '../entities/category_entity';

export class CategoryResponse {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(content: CategoryEntity): CategoryResponse {
    return new CategoryResponse(
      content.id,
      content.title,
      content.description ?? null,
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static convertListFromEntities(
    contents: CategoryEntity[],
  ): CategoryResponse[] {
    return contents.map((content) => this.convertFromEntity(content)!);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): CategoryResponse {
    return new CategoryResponse(
      content.id,
      content.title,
      content.description,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
