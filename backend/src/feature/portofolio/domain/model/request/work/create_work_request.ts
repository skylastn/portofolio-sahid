import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WorkEntity } from '../../entities/work/work_entity';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
export class CreateWorkRequest {
  @IsString()
  company_name: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  @IsString()
  company_url: string | null;

  @IsString()
  job_title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @IsOptional()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return new Date(value);
  })
  @Type(() => Date)
  @IsDate()
  end_date: Date | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  image_path: string | null;

  convertToEntity(): WorkEntity {
    const entity = new WorkEntity();
    entity.jobTitle = this.job_title;
    entity.description = this.description;
    entity.startDate = this.start_date;
    if (FormatHelper.isPresent(this.end_date)) {
      entity.endDate = this.end_date;
    }
    entity.companyName = this.company_name;
    if (FormatHelper.isPresent(this.company_url)) {
      entity.companyUrl = this.company_url;
    }
    if (FormatHelper.isPresent(this.image_path)) {
      entity.imagePath = this.image_path;
    }
    return entity;
  }
}
