import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { CreateGeneralRequest } from "../model/request/general/create_general_request";
import { GeneralResponse } from "../model/response/general_response";

export interface GeneralRepository {
  fetchGenerals(): Promise<Either<ResponseModel, GeneralResponse.Data[]>>;
  fetchGeneralById(id: string): Promise<Either<ResponseModel, GeneralResponse.Data>>;
  createGeneral(
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>>;
  updateGeneral(
    id: string,
    request: CreateGeneralRequest,
  ): Promise<Either<ResponseModel, GeneralResponse.Data>>;
  deleteGeneral(id: string): Promise<Either<ResponseModel, boolean>>;
}
