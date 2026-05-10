import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CreateToolRequest } from "../../domain/model/request/tool/create_tool_request";
import { ToolRequest } from "../../domain/model/request/tool/tool_request";
import { ToolResponse } from "../../domain/model/response/tool_response";

export class ToolRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.UPLOAD_SIGNATURE,
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

  async fetchTools(
    query?: ToolRequest,
  ): Promise<Either<ResponseModel, ResponseModel<ToolResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.TOOL,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
        },
      });
      if (response.status == false) return left(response);
      const parsed = ToolResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<ToolResponse.Data[]>();
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

  async fetchToolById(
    id: string,
  ): Promise<Either<ResponseModel, ToolResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.TOOL}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) return left(response);
      const parsed = ToolResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createTool(
    request: CreateToolRequest,
  ): Promise<Either<ResponseModel, ToolResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.TOOL,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = ToolResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateTool(
    id: string,
    request: CreateToolRequest,
  ): Promise<Either<ResponseModel, ToolResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.TOOL}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = ToolResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteTool(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.TOOL}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) return left(response);
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
