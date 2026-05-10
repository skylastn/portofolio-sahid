import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { ToolEntity } from '../../entities/tool_entity';

export class CreateToolRequest {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  description?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  image_path?: string | null;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value ?? 0))
  position?: number;

  convertToEntity(): ToolEntity {
    const entity = new ToolEntity();
    entity.title = this.title;
    entity.description = this.description ?? null;
    entity.imagePath = this.image_path ?? null;
    entity.position = this.position ?? 0;
    return entity;
  }
}
