import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { CreateFrameworkRequest } from "../domain/model/request/framework/create_framework_request";
import { FrameworkRequest } from "../domain/model/request/framework/framework_request";
import { FrameworkResponse } from "../domain/model/response/framework_response";
import { FrameworkRepository } from "../domain/repository/framework_repository";
import { FrameworkRemoteDataSource } from "../infrastructure/data_source/framework_remote_data_source";
import { FrameworkRepositoryImpl } from "../infrastructure/persistence/framework_repository_impl";

export class FrameworkService {
  private repo: FrameworkRepository;

  constructor() {
    this.repo = new FrameworkRepositoryImpl(new FrameworkRemoteDataSource());
  }

  async fetchFrameworks(
    query?: FrameworkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<FrameworkResponse.Data[]>>> {
    return await this.repo.fetchFrameworks(query);
  }

  async fetchFrameworkById(
    id: string,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    return await this.repo.fetchFrameworkById(id);
  }

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    return await this.repo.createUploadSignature(imageName);
  }

  async createFramework(
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    return await this.repo.createFramework(request);
  }

  async updateFramework(
    id: string,
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    return await this.repo.updateFramework(id, request);
  }

  async deleteFramework(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteFramework(id);
  }
}
