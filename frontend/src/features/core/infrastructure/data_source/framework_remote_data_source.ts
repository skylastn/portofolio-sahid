import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CreateFrameworkRequest } from "../../domain/model/request/framework/create_framework_request";
import { FrameworkRequest } from "../../domain/model/request/framework/framework_request";
import { FrameworkResponse } from "../../domain/model/response/framework_response";

export class FrameworkRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async fetchFrameworks(
    query?: FrameworkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<FrameworkResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.FRAMEWORK,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
        },
      });
      if (response.status == false) return left(response);
      const parsed = FrameworkResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<FrameworkResponse.Data[]>();
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

  async fetchFrameworkById(
    id: string,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.FRAMEWORK}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) return left(response);
      const parsed = FrameworkResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createFramework(
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.FRAMEWORK,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = FrameworkResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateFramework(
    id: string,
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.FRAMEWORK}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = FrameworkResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteFramework(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.FRAMEWORK}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) return left(response);
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
