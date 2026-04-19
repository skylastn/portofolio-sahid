import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateGeneralRequest } from "../domain/model/request/general/create_general_request";
import { GeneralResponse } from "../domain/model/response/general_response";
import { GeneralRepository } from "../domain/repository/general_repository";
import { GeneralRemoteDataSource } from "../infrastructure/data_source/general_remote_data_source";
import { GeneralRepositoryImpl } from "../infrastructure/persistence/general_repository_impl";

export class GeneralService {
  private repo: GeneralRepository;

  constructor() {
    this.repo = new GeneralRepositoryImpl(new GeneralRemoteDataSource());
  }

  async fetchGenerals(): Promise<Either<ResponseModel, GeneralResponse.Data[]>> {
    return await this.repo.fetchGenerals();
  }

  async fetchGeneralById(
    id: string,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    return await this.repo.fetchGeneralById(id);
  }

  async createGeneral(
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    return await this.repo.createGeneral(request);
  }

  async updateGeneral(
    id: string,
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>> {
    return await this.repo.updateGeneral(id, request);
  }

  async deleteGeneral(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteGeneral(id);
  }
}
