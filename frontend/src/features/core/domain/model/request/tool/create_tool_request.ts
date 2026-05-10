export interface CreateToolRequest {
  title: string;
  description?: string | null;
  image_path?: string | null;
  position?: number;
}
