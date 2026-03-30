import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { PortofolioEntity } from '../../entities/portofolio/portofolio_entity';
import { CreatePortofolioAppsSourceRequest } from './apps_source/create_portofolio_apps_source_request';

export class CreatePortofolioRequest {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  thumbnail_path: string | null;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePortofolioAppsSourceRequest)
  apps_sources: CreatePortofolioAppsSourceRequest[];

  @IsArray()
  @IsOptional()
  deleted_apps_source_ids: string[];

  @IsArray()
  @IsOptional()
  images: string[];

  @IsArray()
  @IsOptional()
  deleted_image_ids: string[];

  @IsArray()
  @IsOptional()
  category_ids: string[];

  @IsArray()
  @IsOptional()
  deleted_category_ids: string[];
  
  @IsArray()
  @IsOptional()
  framework_ids: string[];

  @IsArray()
  @IsOptional()
  deleted_framework_ids: string[];

  convertToEntity(): PortofolioEntity {
    const entity = new PortofolioEntity();
    entity.title = this.title;
    entity.description = this.description;
    if (FormatHelper.isPresent(this.thumbnail_path)) {
      entity.thumbnailPath = this.thumbnail_path;
    }
    return entity;
  }
}
