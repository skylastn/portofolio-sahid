import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CodeLanguageRequest } from "../domain/model/request/code_language/code_language_request";
import { CreateCodeLanguageRequest } from "../domain/model/request/code_language/create_code_language_request";
import { CodeLanguageResponse } from "../domain/model/response/code_language_response";
import { CodeLanguageRepository } from "../domain/repository/code_language_repository";
import { CodeLanguageRemoteDataSource } from "../infrastructure/data_source/code_language_remote_data_source";
import { CodeLanguageRepositoryImpl } from "../infrastructure/persistence/code_language_repository_impl";

export class CodeLanguageService {
  private repo: CodeLanguageRepository;

  constructor() {
    this.repo = new CodeLanguageRepositoryImpl(
      new CodeLanguageRemoteDataSource(),
    );
  }

  async fetchCodeLanguages(
    query?: CodeLanguageRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CodeLanguageResponse.Data[]>>> {
    return await this.repo.fetchCodeLanguages(query);
  }

  async fetchCodeLanguageById(
    id: string,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    return await this.repo.fetchCodeLanguageById(id);
  }

  async createCodeLanguage(
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    return await this.repo.createCodeLanguage(request);
  }

  async updateCodeLanguage(
    id: string,
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    return await this.repo.updateCodeLanguage(id, request);
  }

  async deleteCodeLanguage(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteCodeLanguage(id);
  }
}
