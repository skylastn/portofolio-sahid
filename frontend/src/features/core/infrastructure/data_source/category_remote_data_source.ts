import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { CategoryRequest } from "../../domain/model/request/category/category_request";
import { CreateCategoryRequest } from "../../domain/model/request/category/create_category_request";
import { CategoryResponse } from "../../domain/model/response/category_response";

export class CategoryRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async fetchCategories(
    query?: CategoryRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CategoryResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.CATEGORY,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
        },
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = CategoryResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<CategoryResponse.Data[]>();
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

  async fetchCategoryById(
    id: string,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CATEGORY}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = CategoryResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createCategory(
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.CATEGORY,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = CategoryResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateCategory(
    id: string,
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CATEGORY}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) {
        return left(response);
      }
      const parsed = CategoryResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteCategory(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.CATEGORY}/${id}`,
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
