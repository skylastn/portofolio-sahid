import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequest {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  perPage?: number;
}
