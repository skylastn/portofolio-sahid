import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CodeLanguageRequest } from "../model/request/code_language/code_language_request";
import { CreateCodeLanguageRequest } from "../model/request/code_language/create_code_language_request";
import { CodeLanguageResponse } from "../model/response/code_language_response";

export interface CodeLanguageRepository {
  fetchCodeLanguages(
    query?: CodeLanguageRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CodeLanguageResponse.Data[]>>>;
  fetchCodeLanguageById(
    id: string,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>>;
  createCodeLanguage(
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>>;
  updateCodeLanguage(
    id: string,
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>>;
  deleteCodeLanguage(id: string): Promise<Either<ResponseModel, boolean>>;
}
