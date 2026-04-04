import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { FrameworkEntity } from '../../entities/framework_entity';
import { CodeLanguageEntity } from '../../entities/code_language_entity';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';

export class CreateCodeLanguageRequest {
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

  convertToEntity(): CodeLanguageEntity {
    const entity = new CodeLanguageEntity();
    entity.title = this.title;
    entity.description = this.description;
    if(FormatHelper.isPresent(this.image_path)){
      entity.imagePath = this.image_path;
    }
    return entity;
  }
}
