import { SessionData } from "@/shared/constant/session";
import { UserResponse } from "../../../domain/model/response/user_response";

export class AuthLocalDataSource {
  constructor(private localDb = new SessionData()) {}
  login(token: string, user?: UserResponse.Data): void {
    this.localDb.saveToken(token);
    this.localDb.saveUser(user);
  }

  logout(): void {
    this.localDb.clearToken();
    this.localDb.saveUser(undefined);
  }

  get isLogin(): boolean {
    return !!this.localDb.token;
  }

  get user(): UserResponse.Data | null {
    return this.localDb.user;
  }

  saveIsDarkMode(value: boolean): void {
    return this.localDb.saveIsDarkMode(value);
  }

  get isDarkMode(): boolean {
    return this.localDb.isDarkMode;
  }
}
