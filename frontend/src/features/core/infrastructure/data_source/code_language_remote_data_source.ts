import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CodeLanguageRequest } from "../../domain/model/request/code_language/code_language_request";
import { CreateCodeLanguageRequest } from "../../domain/model/request/code_language/create_code_language_request";
import { CodeLanguageResponse } from "../../domain/model/response/code_language_response";

export class CodeLanguageRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CODE_LANGUAGE}/upload-signature`,
        method: HttpMethod.POST,
        data: { image_name: imageName },
      });
      if (response.status == false) return left(response);
      const parsed = MinioUploadResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async fetchCodeLanguages(
    query?: CodeLanguageRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CodeLanguageResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.CODE_LANGUAGE,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
        },
      });
      if (response.status == false) return left(response);
      const parsed = CodeLanguageResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<CodeLanguageResponse.Data[]>();
      result.status = !!parsed.status;
      result.message = parsed.message;
      result.total = parsed.total;
      result.perPage = parsed.perPage;
      result.currentPage = parsed.currentPage;
      result.data = parsed.data ?? [];
      return right(result);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async fetchCodeLanguageById(
    id: string,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CODE_LANGUAGE}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) return left(response);
      const parsed = CodeLanguageResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createCodeLanguage(
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.CODE_LANGUAGE,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = CodeLanguageResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateCodeLanguage(
    id: string,
    request: CreateCodeLanguageRequest,
  ): Promise<Either<ResponseModel, CodeLanguageResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CODE_LANGUAGE}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = CodeLanguageResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteCodeLanguage(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CODE_LANGUAGE}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) return left(response);
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
