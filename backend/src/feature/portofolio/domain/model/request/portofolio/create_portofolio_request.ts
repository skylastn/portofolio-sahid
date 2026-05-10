import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
} from 'class-validator';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { PortofolioEntity } from '../../entities/portofolio/portofolio_entity';
import { CreatePortofolioAppsSourceRequest } from './apps_source/create_portofolio_apps_source_request';

export class CreatePortofolioRequest {
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  work_id?: string | null;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  thumbnail_path?: string | null;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePortofolioAppsSourceRequest)
  apps_sources?: CreatePortofolioAppsSourceRequest[];

  @IsArray()
  @IsOptional()
  deleted_apps_source_ids?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  deleted_image_ids?: string[];

  @IsArray()
  @IsOptional()
  category_ids?: string[];

  @IsArray()
  @IsOptional()
  deleted_category_ids?: string[];

  @IsArray()
  @IsOptional()
  framework_ids?: string[];

  @IsArray()
  @IsOptional()
  deleted_framework_ids?: string[];

  @IsArray()
  @IsOptional()
  tool_ids?: string[];

  @IsArray()
  @IsOptional()
  deleted_tool_ids?: string[];

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value ?? 0))
  position?: number;

  convertToEntity(): PortofolioEntity {
    const entity = new PortofolioEntity();
    if (FormatHelper.isPresent(this.work_id)) {
      entity.workId = this.work_id;
    }
    entity.title = this.title;
    entity.description = this.description;
    entity.position = this.position ?? 0;
    if (FormatHelper.isPresent(this.thumbnail_path)) {
      entity.thumbnailPath = this.thumbnail_path;
    }
    return entity;
  }
}
