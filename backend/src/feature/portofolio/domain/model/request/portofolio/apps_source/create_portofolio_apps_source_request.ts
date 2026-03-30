import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PortofolioAppsSourceEntity } from '../../../entities/portofolio/portofolio_apps_source_entity';
import { FormatHelper } from '../../../../../../../shared/utils/utility/format_helper';
import { AppSourceType } from '../../../enum/apps_source_type';

export class CreatePortofolioAppsSourceRequest {
  @IsOptional()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return value;
  })
  @IsUUID()
  id: string | null;

  @IsString()
  url: string;

  @IsEnum(AppSourceType)
  @Transform(({ value }) => AppSourceType.fromString(value))
  type: AppSourceType;

  convertToEntity(): PortofolioAppsSourceEntity {
    const entity = new PortofolioAppsSourceEntity();
    entity.url = this.url;
    entity.type = this.type;
    return entity;
  }
}
