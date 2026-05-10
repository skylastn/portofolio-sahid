export interface CreateCodeLanguageRequest {
  title: string;
  description: string;
  image_path?: string | null;
  position?: number;
}
