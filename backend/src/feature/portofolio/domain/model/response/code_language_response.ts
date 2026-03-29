import { CodeLanguageEntity } from '../entities/code_language_entity';

export class CodeLanguageResponse {
  id: string;
  title: string;
  description: string;
  imagePath: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string,
    imagePath: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(
    content: CodeLanguageEntity | null,
  ): CodeLanguageResponse | null {
    if (!content) return null;
    return new CodeLanguageResponse(
      content.id,
      content.title,
      content.description,
      content.imagePath,
      content.createdAt,
      content.updatedAt,
      content.deletedAt,
    );
  }

  static convertListFromEntities(
    contents: CodeLanguageEntity[],
  ): CodeLanguageResponse[] {
    return contents.map((content) => this.convertFromEntity(content)!);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image_path: this.imagePath,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): CodeLanguageResponse {
    return new CodeLanguageResponse(
      content.id,
      content.title,
      content.description,
      content.image_path,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
