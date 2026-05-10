import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AchievementEntity } from '../../entities/achievement_entity';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';

export class CreateAchievementRequest {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

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

  convertToEntity(): AchievementEntity {
    const entity = new AchievementEntity();
    entity.title = this.title;
    entity.description = this.description;
    entity.date = this.date;
    entity.position = this.position ?? 0;
    if (FormatHelper.isPresent(this.image_path)) {
      entity.imagePath = this.image_path;
    }
    return entity;
  }
}
