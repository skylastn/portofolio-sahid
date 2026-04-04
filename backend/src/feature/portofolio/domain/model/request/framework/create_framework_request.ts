import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { FrameworkEntity } from '../../entities/framework_entity';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';

export class CreateFrameworkRequest {
  @IsUUID()
  code_language_id!: string;

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
  image_path?: string | null;

  convertToEntity(): FrameworkEntity {
    const entity = new FrameworkEntity();
    entity.codeLanguageId = this.code_language_id;
    entity.title = this.title;
    entity.description = this.description;
    if (FormatHelper.isPresent(this.image_path)) {
      entity.imagePath = this.image_path;
    }
    return entity;
  }
}
