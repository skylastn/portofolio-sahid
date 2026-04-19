import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreatePortofolioRequest } from "../model/request/portofolio/create_portofolio_request";
import { PortofolioRequest } from "../model/request/portofolio/portofolio_request";
import { PortofolioResponse } from "../model/response/portofolio_response";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";

export interface PortofolioRepository {
  fetchPortofolios(
    query?: PortofolioRequest,
  ): Promise<Either<ResponseModel, ResponseModel<PortofolioResponse.Data[]>>>;
  fetchPortofolioById(
    id: string,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>>;
  createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>>;
  createPortofolio(
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>>;
  updatePortofolio(
    id: string,
    request: CreatePortofolioRequest,
  ): Promise<Either<ResponseModel, PortofolioResponse.Data>>;
  deletePortofolio(id: string): Promise<Either<ResponseModel, boolean>>;
}
