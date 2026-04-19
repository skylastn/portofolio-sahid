import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CreateGeneralRequest } from "../../domain/model/request/general/create_general_request";
import { GeneralResponse } from "../../domain/model/response/general_response";

export class GeneralRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async fetchGenerals(): Promise<Either<ResponseModel, GeneralResponse.Data[]>> {
    try {
      const response = await this.api.request({
        path: UrlPath.GENERAL,
        method: HttpMethod.GET,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = GeneralResponse.ConvertList.fromJson(JSON.stringify(response));
      return right(parsed.data ?? []);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async fetchGeneralById(
    id: string,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.GENERAL}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = GeneralResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createGeneral(
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.GENERAL,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = GeneralResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateGeneral(
    id: string,
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.GENERAL}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = GeneralResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteGeneral(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.GENERAL}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) {
        return left(response);
      }
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
