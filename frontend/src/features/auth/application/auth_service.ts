import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { LoginRequest } from "../domain/model/request/login_request";
import { LoginResponse } from "../domain/model/response/login_response";
import { AuthRepository } from "../domain/repository/auth_repository";
import { AuthLocalDataSource } from "../infrastructure/data_source/local/auth_local_data_source";
import { AuthRemoteDataSource } from "../infrastructure/data_source/remote/auth_remote_data_source";
import { AuthRepositoryImpl } from "../infrastructure/persistence/auth_repository_impl";
import { UserResponse } from "../domain/model/response/user_response";

export class AuthService {
  private repo: AuthRepository;
  constructor() {
    this.repo = new AuthRepositoryImpl(
      new AuthLocalDataSource(),
      new AuthRemoteDataSource(),
    );
  }

  get isLogin(): boolean {
    return this.repo.isLogin;
  }

  async login(
    request: LoginRequest,
  ): Promise<Either<ResponseModel, LoginResponse>> {
    return await this.repo.login(request);
  }

  async refreshSession(): Promise<Either<ResponseModel, LoginResponse>> {
    return await this.repo.refreshSession();
  }

  async loginWithPhone(phone: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.loginWithPhone(phone);
  }

  async fetchUser(
    id: string,
  ): Promise<Either<ResponseModel, UserResponse.Data>> {
    return await this.repo.fetchUser(id);
  }

  async logout(): Promise<Either<string, boolean>> {
    return await this.repo.logout();
  }

  saveIsDarkMode(value: boolean): void {
    return this.repo.saveIsDarkMode(value);
  }

  get isDarkMode(): boolean {
    return this.repo.isDarkMode;
  }

  get user(): UserResponse.Data | null {
    return this.repo.user;
  }
}
