import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CategoryRequest } from "../model/request/category/category_request";
import { CreateCategoryRequest } from "../model/request/category/create_category_request";
import { CategoryResponse } from "../model/response/category_response";

export interface CategoryRepository {
  fetchCategories(
    query?: CategoryRequest,
  ): Promise<Either<ResponseModel, ResponseModel<CategoryResponse.Data[]>>>;
  fetchCategoryById(id: string): Promise<Either<ResponseModel, CategoryResponse.Data>>;
  createCategory(
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>>;
  updateCategory(
    id: string,
    request: CreateCategoryRequest,
  ): Promise<Either<ResponseModel, CategoryResponse.Data>>;
  deleteCategory(id: string): Promise<Either<ResponseModel, boolean>>;
}
