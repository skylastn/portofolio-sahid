import { IsString, IsOptional } from 'class-validator';

import { PaginationRequest } from '../../../../../../shared/core/model/request/pagination_request';
import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { Transform } from 'class-transformer';

export class WorkRequest extends PaginationRequest {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!FormatHelper.isNotEmpty(value)) return null;
    return String(value);
  })
  search?: string | null;
}
