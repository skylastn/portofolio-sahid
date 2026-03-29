import { PaginationResponse } from '../../../../../shared/core/model/response/pagination_response';
import { CodeLanguageEntity } from '../../model/entities/code_language_entity';
import { CodeLanguageRequest } from '../../model/request/code_language/code_language_request';

export const CODE_LANGUAGE_DATABASE_REPOSITORY =
  'CODE_LANGUAGE_DATABASE_REPOSITORY';
export interface CodeLanguageDatabaseRepository {
  findAllPagination(
    request: CodeLanguageRequest,
  ): Promise<PaginationResponse<CodeLanguageEntity>>;
  findAllByListIds(ids: string[]): Promise<CodeLanguageEntity[]>;
  findOneById(id: string): Promise<CodeLanguageEntity | null>;
  createOrUpdate(data: CodeLanguageEntity): Promise<CodeLanguageEntity | null>;
  removeById(id: string): Promise<void>;
}
