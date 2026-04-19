import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateWorkRequest } from "../../domain/model/request/work/create_work_request";
import { WorkRequest } from "../../domain/model/request/work/work_request";
import { WorkResponse } from "../../domain/model/response/work_response";
import { WorkRepository } from "../../domain/repository/work_repository";
import { WorkRemoteDataSource } from "../data_source/work_remote_data_source";

export class WorkRepositoryImpl implements WorkRepository {
  constructor(private readonly remote: WorkRemoteDataSource) {}

  async fetchWorks(
    query?: WorkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<WorkResponse.Data[]>>> {
    return await this.remote.fetchWorks(query);
  }

  async fetchWorkById(id: string): Promise<Either<ResponseModel, WorkResponse.Data>> {
    return await this.remote.fetchWorkById(id);
  }

  async createWork(
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>> {
    return await this.remote.createWork(request);
  }

  async updateWork(
    id: string,
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>> {
    return await this.remote.updateWork(id, request);
  }

  async deleteWork(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deleteWork(id);
  }
}
