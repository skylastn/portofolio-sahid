import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";
import { CodeLanguageResponse } from "../code_language_response";

export namespace FrameworkCodeMappingResponse {
  export class Data extends BaseModelResponse {
    framework_id?: string;
    code_language_id?: string;
    code_language?: CodeLanguageResponse.Data;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
