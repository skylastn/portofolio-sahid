import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";

export namespace WorkResponse {
  export class Data extends BaseModelResponse {
    company_name?: string;
    company_url?: string | null;
    job_title?: string;
    description?: string;
    start_date?: string;
    end_date?: string | null;
    image_path?: string | null;
    image_url?: string | null;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
