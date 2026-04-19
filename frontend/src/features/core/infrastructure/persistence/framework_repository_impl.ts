import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateFrameworkRequest } from "../../domain/model/request/framework/create_framework_request";
import { FrameworkRequest } from "../../domain/model/request/framework/framework_request";
import { FrameworkResponse } from "../../domain/model/response/framework_response";
import { FrameworkRepository } from "../../domain/repository/framework_repository";
import { FrameworkRemoteDataSource } from "../data_source/framework_remote_data_source";

export class FrameworkRepositoryImpl implements FrameworkRepository {
  constructor(private readonly remote: FrameworkRemoteDataSource) {}

  async fetchFrameworks(
    query?: FrameworkRequest,
  ): Promise<Either<ResponseModel, ResponseModel<FrameworkResponse.Data[]>>> {
    return await this.remote.fetchFrameworks(query);
  }

  async fetchFrameworkById(
    id: string,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    return await this.remote.fetchFrameworkById(id);
  }

  async createFramework(
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    return await this.remote.createFramework(request);
  }

  async updateFramework(
    id: string,
    request: CreateFrameworkRequest,
  ): Promise<Either<ResponseModel, FrameworkResponse.Data>> {
    return await this.remote.updateFramework(id, request);
  }

  async deleteFramework(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deleteFramework(id);
  }
}
