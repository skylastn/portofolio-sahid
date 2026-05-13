import { BaseModelResponse } from "../../../../../shared/domain/model/response/base_model_response";
import { BaseResponse } from "../../../../../shared/domain/model/response/base_response";
import { ConvertResponse } from "../../../../../shared/domain/model/response/convert_response";

export namespace GeneralResponse {
  export class Data extends BaseModelResponse {
    title?: string;
    description?: string;
    email?: string;
    github_url?: string;
    gitlab_url?: string;
    linkedin_url?: string;
    thread_url?: string;
    tiktok_url?: string;
    cv_path?: string | null;
    cv_url?: string | null;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
