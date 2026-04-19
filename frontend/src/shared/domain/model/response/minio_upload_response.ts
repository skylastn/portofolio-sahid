import { BaseResponse } from "./base_response";
import { ConvertResponse } from "./convert_response";

export namespace MinioUploadResponse {
  export interface Data {
    key: string;
    url: string;
  }

  export type Response = BaseResponse<Data>;

  export const Convert = ConvertResponse<Response>();
}
