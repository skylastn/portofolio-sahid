import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CodeLanguageRequest } from "../../domain/model/request/code_language/code_language_request";
import { CreateCodeLanguageRequest } from "../../domain/model/request/code_language/create_code_language_request";
import { CodeLanguageResponse } from "../../domain/model/response/code_language_response";
import { CodeLanguageRepository } from "../../domain/repository/code_language_repository";
import { CodeLanguageRemoteDataSource } from "../data_source/code_language_remote_data_source";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";

export class CodeLanguageRepositoryImpl implements CodeLanguageRepository {
  constructor(private readonly remote: CodeLanguageRemoteDataSource) {}

  async fetchCodeLanguages(
    query?: CodeLanguageRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CodeLanguageResponse.Data[]>>> {
    return await this.remote.fetchCodeLanguages(query);
  }

  async fetchCodeLanguageById(
    id: string,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    return await this.remote.fetchCodeLanguageById(id);
  }

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    return await this.remote.createUploadSignature(imageName);
  }

  async createCodeLanguage(
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    return await this.remote.createCodeLanguage(request);
  }

  async updateCodeLanguage(
    id: string,
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    return await this.remote.updateCodeLanguage(id, request);
  }

  async deleteCodeLanguage(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deleteCodeLanguage(id);
  }
}
