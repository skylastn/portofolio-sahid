import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";
import { CodeLanguageResponse } from "./code_language_response";
import { FrameworkCodeMappingResponse } from "./framework_code_mapping/framework_code_mapping_response";

export namespace FrameworkResponse {
  export class Data extends BaseModelResponse {
    code_language_id?: string;
    code_language?: CodeLanguageResponse.Data | null;
    title?: string;
    description?: string;
    image_path?: string | null;
    image_url?: string | null;
    position?: number;
    code_language_mappings?: FrameworkCodeMappingResponse.Data[];
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
