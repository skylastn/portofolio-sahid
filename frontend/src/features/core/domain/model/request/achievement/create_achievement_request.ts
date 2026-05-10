export interface CreateAchievementRequest {
  title: string;
  description: string;
  date: string;
  image_path?: string | null;
  position?: number;
}
