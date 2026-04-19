import { BaseModelResponse } from "../../../../../shared/domain/model/response/base_model_response";
import { BaseResponse } from "../../../../../shared/domain/model/response/base_response";
import { ConvertResponse } from "../../../../../shared/domain/model/response/convert_response";
import { UserRole } from "../enum/user_role";

export namespace UserResponse {
  export class Data extends BaseModelResponse {
    name?: string;
    username?: string;
    phone?: string;
    role?: UserRole;
    is_active?: boolean;
    is_verified_at?: Date;
  }

  export type ResponseList = BaseResponse<Data[]>;
  export type Response = BaseResponse<Data>;
  export const Convert = ConvertResponse<Response>();
  export const ConvertList = ConvertResponse<ResponseList>();
}
