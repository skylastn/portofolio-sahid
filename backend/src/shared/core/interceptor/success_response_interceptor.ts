import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormatHelper } from '../../utils/utility/format_helper';

function isPaginationResponse(payload: any): boolean {
  return (
    payload &&
    typeof payload === 'object' &&
    typeof payload.status === 'boolean' &&
    typeof payload.message === 'string' &&
    typeof payload.currentPage === 'number' &&
    typeof payload.perPage === 'number' &&
    typeof payload.total === 'number' &&
    Array.isArray(payload.data) &&
    payload.meta &&
    typeof payload.meta === 'object' &&
    typeof payload.meta.first === 'number' &&
    typeof payload.meta.last === 'number'
  );
}

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((payload) => {
        // Kalau sudah pagination, biarkan.
        if (isPaginationResponse(payload)) {
          return {
            ...payload,
            data: FormatHelper.serializeData(payload.data),
          };
        }
        // Selain itu, bungkus normal.
        return {
          status: true,
          message: 'Success',
          data: FormatHelper.serializeData(payload),
        };
      }),
    );
  }
}
