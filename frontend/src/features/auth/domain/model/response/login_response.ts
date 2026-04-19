import { BaseModelResponse } from "@/shared/domain/model/response/base_model_response";
import { BaseResponse } from "@/shared/domain/model/response/base_response";
import { ConvertResponse } from "@/shared/domain/model/response/convert_response";
import { UserResponse } from "./user_response";

export type LoginResponseWrapper = BaseResponse<LoginResponse>;
export type LoginResponseListWrapper = BaseResponse<LoginResponse[]>;

export class LoginResponse extends BaseModelResponse {
  access_token: string;
  refresh_token: string;
  user?: UserResponse.Data;

  constructor(
    access_token: string,
    refresh_token: string,
    user?: UserResponse.Data,
  ) {
    super();
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.user = user;
  }

  static Convert = ConvertResponse<LoginResponseWrapper>();
  static ConvertList = ConvertResponse<LoginResponseListWrapper>();
}
