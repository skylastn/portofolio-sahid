import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { WorkRequest } from "../model/request/work/work_request";
import { CreateWorkRequest } from "../model/request/work/create_work_request";
import { WorkResponse } from "../model/response/work_response";

export interface WorkRepository {
  fetchWorks(
    query?: WorkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<WorkResponse.Data[]>>>;
  fetchWorkById(id: string): Promise<Either<ResponseModel, WorkResponse.Data>>;
  createWork(
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>>;
  updateWork(
    id: string,
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>>;
  deleteWork(id: string): Promise<Either<ResponseModel, boolean>>;
}
