import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CategoryRequest } from "../domain/model/request/category/category_request";
import { CreateCategoryRequest } from "../domain/model/request/category/create_category_request";
import { CategoryResponse } from "../domain/model/response/category_response";
import { CategoryRepository } from "../domain/repository/category_repository";
import { CategoryRemoteDataSource } from "../infrastructure/data_source/category_remote_data_source";
import { CategoryRepositoryImpl } from "../infrastructure/persistence/category_repository_impl";

export class CategoryService {
  private repo: CategoryRepository;

  constructor() {
    this.repo = new CategoryRepositoryImpl(new CategoryRemoteDataSource());
  }

  async fetchCategories(
    query?: CategoryRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CategoryResponse.Data[]>>> {
    return await this.repo.fetchCategories(query);
  }

  async fetchCategoryById(
    id: string,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    return await this.repo.fetchCategoryById(id);
  }

  async createCategory(
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    return await this.repo.createCategory(request);
  }

  async updateCategory(
    id: string,
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>> {
    return await this.repo.updateCategory(id, request);
  }

  async deleteCategory(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteCategory(id);
  }
}
