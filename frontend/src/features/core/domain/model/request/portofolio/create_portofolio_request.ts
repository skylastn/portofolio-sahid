export interface CreatePortofolioRequest {
  work_id?: string | null;
  title: string;
  description: string;
  thumbnail_path?: string | null;
  apps_sources?: unknown[];
  deleted_apps_source_ids?: string[];
  images?: string[];
  deleted_image_ids?: string[];
  category_ids?: string[];
  deleted_category_ids?: string[];
  framework_ids?: string[];
  deleted_framework_ids?: string[];
}
