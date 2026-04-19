import { BaseModelResponse } from "../../../../../../shared/domain/model/response/base_model_response";
import { BaseResponse } from "../../../../../../shared/domain/model/response/base_response";
import { ConvertResponse } from "../../../../../../shared/domain/model/response/convert_response";
import { FrameworkResponse } from "../framework_response";

export namespace PortofolioFrameworkMappingResponse {
  export class Data extends BaseModelResponse {
    portofolio_id?: string;
    framework_id?: string;
    framework?: FrameworkResponse.Data;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
