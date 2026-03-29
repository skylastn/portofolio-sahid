import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CategoryEntity } from '../../entities/category_entity';

export class CreateCategoryRequest {
  @IsString()
  title: string;

  @IsString()
  description: string;

  convertToEntity(): CategoryEntity {
    const entity = new CategoryEntity();
    entity.title = this.title;
    entity.description = this.description;
    return entity;
  }
}
