import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from '../../../../../../shared/core/model/request/pagination_request';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';

export class ToolRequest extends PaginationRequest {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  search?: string | null;
}
