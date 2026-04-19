import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreatePortofolioRequest } from "../../domain/model/request/portofolio/create_portofolio_request";
import { PortofolioRequest } from "../../domain/model/request/portofolio/portofolio_request";
import { PortofolioResponse } from "../../domain/model/response/portofolio_response";
import { PortofolioRepository } from "../../domain/repository/portofolio_repository";
import { PortofolioRemoteDataSource } from "../data_source/portofolio_remote_data_source";

export class PortofolioRepositoryImpl implements PortofolioRepository {
  constructor(private readonly remote: PortofolioRemoteDataSource) {}

  async fetchPortofolios(
    query?: PortofolioRequest,
  ): Promise<Either<ResponseModel, ResponseModel<PortofolioResponse.Data[]>>> {
    return await this.remote.fetchPortofolios(query);
  }

  async fetchPortofolioById(
    id: string,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    return await this.remote.fetchPortofolioById(id);
  }

  async createPortofolio(
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    return await this.remote.createPortofolio(request);
  }

  async updatePortofolio(
    id: string,
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    return await this.remote.updatePortofolio(id, request);
  }

  async deletePortofolio(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deletePortofolio(id);
  }
}
