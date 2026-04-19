import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";

export namespace PortofolioResponse {
  export class Data extends BaseModelResponse {
    work_id?: string | null;
    title?: string;
    description?: string;
    thumbnail_path?: string | null;
    thumbnail_url?: string | null;
    work?: {
      id?: string;
      company_name?: string;
      job_title?: string;
    } | null;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
