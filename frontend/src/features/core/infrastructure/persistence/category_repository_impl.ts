import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CategoryRequest } from "../../domain/model/request/category/category_request";
import { CreateCategoryRequest } from "../../domain/model/request/category/create_category_request";
import { CategoryResponse } from "../../domain/model/response/category_response";
import { CategoryRepository } from "../../domain/repository/category_repository";
import { CategoryRemoteDataSource } from "../data_source/category_remote_data_source";

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly remote: CategoryRemoteDataSource) {}

  async fetchCategories(
    query?: CategoryRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CategoryResponse.Data[]>>> {
    return await this.remote.fetchCategories(query);
  }

  async fetchCategoryById(
    id: string,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    return await this.remote.fetchCategoryById(id);
  }

  async createCategory(
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    return await this.remote.createCategory(request);
  }

  async updateCategory(
    id: string,
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    return await this.remote.updateCategory(id, request);
  }

  async deleteCategory(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deleteCategory(id);
  }
}
