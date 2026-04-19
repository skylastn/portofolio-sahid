import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CreatePortofolioRequest } from "../../domain/model/request/portofolio/create_portofolio_request";
import { PortofolioRequest } from "../../domain/model/request/portofolio/portofolio_request";
import { PortofolioResponse } from "../../domain/model/response/portofolio/portofolio_response";

export class PortofolioRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.PORTOFOLIO}/upload-signature`,
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

  async createImageUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.PORTOFOLIO}/images/upload-signature`,
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

  async fetchPortofolios(
    query?: PortofolioRequest,
  ): Promise<Either<ResponseModel, ResponseModel<PortofolioResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.PORTOFOLIO,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
          work_id: query?.work_id,
        },
      });
      if (response.status == false) return left(response);
      const parsed = PortofolioResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<PortofolioResponse.Data[]>();
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

  async fetchPortofolioById(
    id: string,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.PORTOFOLIO}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) return left(response);
      const parsed = PortofolioResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createPortofolio(
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.PORTOFOLIO,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = PortofolioResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updatePortofolio(
    id: string,
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.PORTOFOLIO}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = PortofolioResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deletePortofolio(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.PORTOFOLIO}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) return left(response);
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
