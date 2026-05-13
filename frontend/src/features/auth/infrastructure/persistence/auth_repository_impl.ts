import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { LoginRequest } from "../../domain/model/request/login_request";
import { LoginResponse } from "../../domain/model/response/login_response";
import { AuthRepository } from "../../domain/repository/auth_repository";
import { AuthLocalDataSource } from "../data_source/local/auth_local_data_source";
import { AuthRemoteDataSource } from "../data_source/remote/auth_remote_data_source";
import { UserResponse } from "../../domain/model/response/user_response";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly local: AuthLocalDataSource,
    private readonly remote: AuthRemoteDataSource,
  ) {}
  async login(
    request: LoginRequest,
  ): Promise<Either<ResponseModel, LoginResponse>> {
    const result = await this.remote.login(request);
    result.fold(
      () => undefined,
      (data) => this.local.login(data.access_token, data.user),
    );
    return result;
  }

  async refreshSession(): Promise<Either<ResponseModel, LoginResponse>> {
    const result = await this.remote.refreshSession();
    result.fold(
      () => undefined,
      (data) => this.local.login(data.access_token, data.user),
    );
    return result;
  }

  async loginWithPhone(phone: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.loginWithPhone(phone);
  }

  async fetchUser(
    id: string,
  ): Promise<Either<ResponseModel, UserResponse.Data>> {
    return await this.remote.fetchUser(id);
  }

  async logout(): Promise<Either<string, boolean>> {
    return await this.remote.logout();
  }

  saveIsDarkMode(value: boolean): void {
    return this.local.saveIsDarkMode(value);
  }

  get isDarkMode(): boolean {
    return this.local.isDarkMode;
  }

  get user(): UserResponse.Data | null {
    return this.local.user;
  }

  get isLogin(): boolean {
    return this.local.isLogin;
  }
}
