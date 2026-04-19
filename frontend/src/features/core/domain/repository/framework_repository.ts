import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { FrameworkRequest } from "../model/request/framework/framework_request";
import { CreateFrameworkRequest } from "../model/request/framework/create_framework_request";
import { FrameworkResponse } from "../model/response/framework_response";

export interface FrameworkRepository {
  fetchFrameworks(
    query?: FrameworkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<FrameworkResponse.Data[]>>>;
  fetchFrameworkById(
    id: string,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>>;
  createFramework(
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>>;
  updateFramework(
    id: string,
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>>;
  deleteFramework(id: string): Promise<Either<ResponseModel, boolean>>;
}
