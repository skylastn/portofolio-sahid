import { UserResponse } from "@/features/auth/domain/model/response/user_response";

export class SessionData {
  private setItem(key: string, value: string) {
    if (typeof window === "undefined") return; // SSR guard
    localStorage.setItem(key, value);
  }

  private removeItem(key: string) {
    if (typeof window === "undefined") return; // SSR guard
    localStorage.removeItem(key);
  }

  private getItem(key: string) {
    if (typeof window === "undefined") return null; // SSR guard
    return localStorage.getItem(key);
  }

  saveToken(token: string): void {
    this.setItem("access_token", token);
  }

  get token(): string | null {
    return this.getItem("access_token");
  }

  saveRefreshToken(token: string): void {
    this.setItem("refresh_token", token);
  }

  get refreshToken(): string | null {
    return this.getItem("refresh_token");
  }

  saveUser(user?: UserResponse.Data): void {
    if (!user) {
      this.removeItem("user");
      return;
    }

    this.setItem("user", JSON.stringify(user));
  }

  get user(): UserResponse.Data | null {
    const temp = this.getItem("user");
    if (!temp) return null;
    return JSON.parse(temp) as UserResponse.Data;
    // try {
    //   return JSON.parse(temp) as UserResponse.Data;
    // } catch {
    //   this.removeItem("user");
    //   return null;
    // }
  }

  saveIsDarkMode(value: boolean): void {
    this.setItem("is_dark_mode", value.toString());
  }

  get isDarkMode(): boolean {
    const temp = this.getItem("is_dark_mode");
    return temp == "false" ? false : true;
  }
}
