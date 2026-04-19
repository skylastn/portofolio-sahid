import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { CreateWorkRequest } from "../domain/model/request/work/create_work_request";
import { WorkRequest } from "../domain/model/request/work/work_request";
import { WorkResponse } from "../domain/model/response/work_response";
import { WorkRepository } from "../domain/repository/work_repository";
import { WorkRemoteDataSource } from "../infrastructure/data_source/work_remote_data_source";
import { WorkRepositoryImpl } from "../infrastructure/persistence/work_repository_impl";

export class WorkService {
  private repo: WorkRepository;

  constructor() {
    this.repo = new WorkRepositoryImpl(new WorkRemoteDataSource());
  }

  async fetchWorks(
    query?: WorkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<WorkResponse.Data[]>>> {
    return await this.repo.fetchWorks(query);
  }

  async fetchWorkById(id: string): Promise<Either<ResponseModel, WorkResponse.Data>> {
    return await this.repo.fetchWorkById(id);
  }

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    return await this.repo.createUploadSignature(imageName);
  }

  async createWork(
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>> {
    return await this.repo.createWork(request);
  }

  async updateWork(
    id: string,
    request: CreateWorkRequest,
  ): Promise<Either<ResponseModel, WorkResponse.Data>> {
    return await this.repo.updateWork(id, request);
  }

  async deleteWork(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteWork(id);
  }
}
