import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CreateWorkRequest } from "../../domain/model/request/work/create_work_request";
import { WorkRequest } from "../../domain/model/request/work/work_request";
import { WorkResponse } from "../../domain/model/response/work_response";

export class WorkRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.WORK}/upload-signature`,
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

  async fetchWorks(
    query?: WorkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<WorkResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.WORK,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
        },
      });
      if (response.status == false) return left(response);
      const parsed = WorkResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<WorkResponse.Data[]>();
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

  async fetchWorkById(id: string): Promise<Either<ResponseModel, WorkResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.WORK}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) return left(response);
      const parsed = WorkResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createWork(
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.WORK,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = WorkResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateWork(
    id: string,
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.WORK}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = WorkResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteWork(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.WORK}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) return left(response);
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
