export interface CreateWorkRequest {
  company_name: string;
  company_url?: string | null;
  job_title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  image_path?: string | null;
}
