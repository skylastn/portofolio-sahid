export type PortofolioAppsSourceType =
  | "web"
  | "android"
  | "ios"
  | "windows"
  | "mac"
  | "linux"
  | "github"
  | "other";

export interface CreatePortofolioAppsSourceRequest {
  id?: string | null;
  url: string;
  type: PortofolioAppsSourceType;
}
