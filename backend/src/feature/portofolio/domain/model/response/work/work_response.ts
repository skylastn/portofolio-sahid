import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../../support/application/minio_service';
import type { WorkEntity } from '../../entities/work/work_entity';

export class WorkResponse {
  id: string;
  companyName: string;
  companyUrl: string | null;
  jobTitle: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  imagePath: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    companyName: string,
    companyUrl: string | null,
    jobTitle: string,
    description: string,
    startDate: Date,
    endDate: Date | null,
    imagePath: string | null,
    imageUrl: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.companyName = companyName;
    this.companyUrl = companyUrl;
    this.jobTitle = jobTitle;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: WorkEntity,
    minioService: MinioService | null = null,
  ): Promise<WorkResponse> {
    return new WorkResponse(
      content.id,
      content.companyName,
      content.companyUrl ?? null,
      content.jobTitle,
      content.description,
      content.startDate,
      content.endDate ?? null,
      content.imagePath ?? null,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.imagePath)
        ? (await minioService.getPresignedViewUrl(content.imagePath)).url
        : null,
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: WorkEntity[],
    minioService: MinioService | null = null,
  ): Promise<WorkResponse[]> {
    return await Promise.all(
      contents.map(
        async (content) => await this.convertFromEntity(content, minioService),
      ),
    );
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      company_name: this.companyName,
      company_url: this.companyUrl,
      job_title: this.jobTitle,
      description: this.description,
      start_date: this.startDate,
      end_date: this.endDate,
      image_path: this.imagePath,
      image_url: this.imageUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): WorkResponse {
    return new WorkResponse(
      content.id,
      content.company_name,
      content.company_url,
      content.job_title,
      content.description,
      content.start_date,
      content.end_date,
      content.image_path,
      content.image_url,
      content.created_at,
      content.updated_at,
      content.deleted_at,
    );
  }
}
