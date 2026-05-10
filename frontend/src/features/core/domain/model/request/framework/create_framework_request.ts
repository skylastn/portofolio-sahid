export interface CreateFrameworkRequest {
  code_language_id: string;
  title: string;
  description: string;
  image_path?: string | null;
  code_language_ids?: string[];
  deleted_code_language_ids?: string[];
  position?: number;
}
