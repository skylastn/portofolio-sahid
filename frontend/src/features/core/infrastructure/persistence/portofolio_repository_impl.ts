import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreatePortofolioRequest } from "../../domain/model/request/portofolio/create_portofolio_request";
import { PortofolioRequest } from "../../domain/model/request/portofolio/portofolio_request";
import { PortofolioResponse } from "../../domain/model/response/portofolio/portofolio_response";
import { PortofolioRepository } from "../../domain/repository/portofolio_repository";
import { PortofolioRemoteDataSource } from "../data_source/portofolio_remote_data_source";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";

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

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    return await this.remote.createUploadSignature(imageName);
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
