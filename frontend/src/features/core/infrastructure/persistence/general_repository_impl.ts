import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateGeneralRequest } from "../../domain/model/request/general/create_general_request";
import { GeneralResponse } from "../../domain/model/response/general_response";
import { GeneralRepository } from "../../domain/repository/general_repository";
import { GeneralRemoteDataSource } from "../data_source/general_remote_data_source";

export class GeneralRepositoryImpl implements GeneralRepository {
  constructor(private readonly remote: GeneralRemoteDataSource) {}

  async fetchGenerals(): Promise<Either<ResponseModel, GeneralResponse.Data[]>> {
    return await this.remote.fetchGenerals();
  }

  async fetchGeneralById(
    id: string,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    return await this.remote.fetchGeneralById(id);
  }

  async createGeneral(
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    return await this.remote.createGeneral(request);
  }

  async updateGeneral(
    id: string,
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    return await this.remote.updateGeneral(id, request);
  }

  async deleteGeneral(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deleteGeneral(id);
  }
}
