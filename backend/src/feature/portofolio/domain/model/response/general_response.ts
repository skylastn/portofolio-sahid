import type { GeneralEntity } from '../entities/general_entity';
import { FormatHelper } from '../../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../../support/application/minio_service';

export class GeneralResponse {
  id: string;
  title: string;
  description: string;
  email: string;
  githubUrl: string;
  gitlabUrl: string;
  linkedinUrl: string;
  threadUrl: string;
  tiktokUrl: string;
  cvPath: string | null;
  cvUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string,
    email: string,
    githubUrl: string,
    gitlabUrl: string,
    linkedinUrl: string,
    threadUrl: string,
    tiktokUrl: string,
    cvPath: string | null,
    cvUrl: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.email = email;
    this.githubUrl = githubUrl;
    this.gitlabUrl = gitlabUrl;
    this.linkedinUrl = linkedinUrl;
    this.threadUrl = threadUrl;
    this.tiktokUrl = tiktokUrl;
    this.cvPath = cvPath;
    this.cvUrl = cvUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static async convertFromEntity(
    content: GeneralEntity | null,
    minioService: MinioService | null = null,
  ): Promise<GeneralResponse | null> {
    if (!content) return null;
    return new GeneralResponse(
      content.id,
      content.title,
      content.description,
      content.email,
      content.githubUrl,
      content.gitlabUrl,
      content.linkedinUrl,
      content.threadUrl,
      content.tiktokUrl,
      content.cvPath ?? null,
      FormatHelper.isPresent(minioService) &&
        FormatHelper.isPresent(content.cvPath)
        ? (await minioService.getPresignedViewUrl(content.cvPath)).url
        : null,
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static async convertListFromEntities(
    contents: GeneralEntity[],
    minioService: MinioService | null = null,
  ): Promise<GeneralResponse[]> {
    const responses = await Promise.all(
      contents.map((content) => this.convertFromEntity(content, minioService)),
    );
    return responses.filter((item): item is GeneralResponse => !!item);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      email: this.email,
      github_url: this.githubUrl,
      gitlab_url: this.gitlabUrl,
      linkedin_url: this.linkedinUrl,
      thread_url: this.threadUrl,
      tiktok_url: this.tiktokUrl,
      cv_path: this.cvPath,
      cv_url: this.cvUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }

  static fromMap(content: any): GeneralResponse {
    return new GeneralResponse(
      content.id,
      content.title,
      content.description,
      content.email,
      content.githubUrl ?? content.github_url,
      content.gitlabUrl ?? content.gitlab_url,
      content.linkedinUrl ?? content.linkedin_url,
      content.threadUrl ?? content.thread_url,
      content.tiktokUrl ?? content.tiktok_url,
      content.cvPath ?? content.cv_path ?? null,
      content.cvUrl ?? content.cv_url ?? null,
      content.createdAt ?? content.created_at,
      content.updatedAt ?? content.updated_at,
      content.deletedAt ?? content.deleted_at,
    );
  }
}
