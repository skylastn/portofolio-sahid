import type { PortofolioCategoryMappingEntity } from '../../entities/portofolio/portofolio_category_mapping_entity';
import { CategoryResponse } from '../category_response';

export class PortofolioCategoryMappingResponse {
  id: string;
  portofolioId: string;
  categoryId: string;
  category: CategoryResponse;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    portofolioId: string,
    categoryId: string,
    category: CategoryResponse,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.portofolioId = portofolioId;
    this.categoryId = categoryId;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(
    content: PortofolioCategoryMappingEntity,
  ): PortofolioCategoryMappingResponse {
    return new PortofolioCategoryMappingResponse(
      content.id,
      content.portofolioId,
      content.categoryId,
      CategoryResponse.convertFromEntity(content.category),
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static convertListFromEntities(
    contents: PortofolioCategoryMappingEntity[],
  ): PortofolioCategoryMappingResponse[] {
    return contents.map((content) => this.convertFromEntity(content)!);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      portofolio_id: this.portofolioId,
      category_id: this.categoryId,
      category: this.category.toMap,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): PortofolioCategoryMappingResponse {
    return new PortofolioCategoryMappingResponse(
      content.id,
      content.portofolio_id,
      content.category_id,
      CategoryResponse.fromMap(content.Category),
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
