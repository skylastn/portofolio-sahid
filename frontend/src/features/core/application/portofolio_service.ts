import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { CreatePortofolioRequest } from "../domain/model/request/portofolio/create_portofolio_request";
import { PortofolioRequest } from "../domain/model/request/portofolio/portofolio_request";
import { PortofolioResponse } from "../domain/model/response/portofolio_response";
import { PortofolioRepository } from "../domain/repository/portofolio_repository";
import { PortofolioRemoteDataSource } from "../infrastructure/data_source/portofolio_remote_data_source";
import { PortofolioRepositoryImpl } from "../infrastructure/persistence/portofolio_repository_impl";

export class PortofolioService {
  private repo: PortofolioRepository;

  constructor() {
    this.repo = new PortofolioRepositoryImpl(new PortofolioRemoteDataSource());
  }

  async fetchPortofolios(
    query?: PortofolioRequest,
  ): Promise<Either<ResponseModel, ResponseModel<PortofolioResponse.Data[]>>> {
    return await this.repo.fetchPortofolios(query);
  }

  async fetchPortofolioById(
    id: string,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    return await this.repo.fetchPortofolioById(id);
  }

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    return await this.repo.createUploadSignature(imageName);
  }

  async createPortofolio(
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    return await this.repo.createPortofolio(request);
  }

  async updatePortofolio(
    id: string,
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>> {
    return await this.repo.updatePortofolio(id, request);
  }

  async deletePortofolio(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deletePortofolio(id);
  }
}
