import { UrlPath } from "@/shared/constant/url_path";
import { ApiClient } from "@/shared/network/api_client";
import { AuthLocalDataSource } from "../local/auth_local_data_source";
import { LoginRequest } from "@/features/auth/domain/model/request/login_request";
import { Either, left, right } from "@/shared/utils/utility/either";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { LoginResponse } from "@/features/auth/domain/model/response/login_response";
import { UserResponse } from "../../../domain/model/response/user_response";

export class AuthRemoteDataSource {
  constructor(
    private local = new AuthLocalDataSource(),
    private api = new ApiClient(),
  ) {}

  async login(
    request: LoginRequest,
  ): Promise<Either<ResponseModel, LoginResponse>> {
    try {
      const response = await this.api.request({
        path: UrlPath.LOGIN,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) {
        if (
          Array.isArray(response.data) &&
          response.data.every((item) => typeof item === "string")
        ) {
          response.message = response.data[0];
          return left(response);
        }
        return left(response);
      }
      const result = LoginResponse.Convert.fromJson(JSON.stringify(response));
      return right(result.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async loginWithPhone(phone: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: UrlPath.LOGIN_WITH_PHONE,
        method: HttpMethod.POST,
        data: {
          phone: phone,
        },
      });
      if (response.status == false) {
        return left(response);
      }
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async fetchUser(
    id: string,
  ): Promise<Either<ResponseModel, UserResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.USER + `/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) {
        return left(response);
      }
      return right(
        UserResponse.Convert.fromJson(JSON.stringify(response)).data!,
      );
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateUser(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: UrlPath.USER + `/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) {
        return left(response);
      }
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async logout(): Promise<Either<string, boolean>> {
    try {
      // await this.api.request({
      //   path: UrlPath.LOGOUT,
      //   method: HttpMethod.POST,
      // });
      this.local.logout();
      return right(true);
    } catch (error) {
      return left(error instanceof Error ? error.message : String(error));
    }
  }
}
