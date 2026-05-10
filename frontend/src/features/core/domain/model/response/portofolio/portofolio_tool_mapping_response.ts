import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";
import { ToolResponse } from "../tool_response";

export namespace PortofolioToolMappingResponse {
  export class Data extends BaseModelResponse {
    portofolio_id?: string;
    tool_id?: string;
    tool?: ToolResponse.Data;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
