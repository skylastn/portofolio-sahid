import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationRequest } from '../../../../../../shared/core/model/request/pagination_request';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';

function transformIdList(value: unknown): string[] | null {
  if (!FormatHelper.isNotEmpty(value)) return null;
  if (Array.isArray(value)) {
    return value.flatMap((item) => String(item).split(',')).filter(Boolean);
  }
  return String(value).split(',').filter(Boolean);
}

export class PortofolioRequest extends PaginationRequest {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  search?: string | null;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Transform(({ value }) => transformIdList(value))
  work_ids?: string[] | null;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Transform(({ value }) => transformIdList(value))
  category_id?: string[] | null;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Transform(({ value }) => transformIdList(value))
  framework_id?: string[] | null;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Transform(({ value }) => transformIdList(value))
  code_language_id?: string[] | null;
}
