import type { GeneralEntity } from '../entities/general_entity';

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
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(
    content: GeneralEntity | null,
  ): GeneralResponse | null {
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
      content.createdAt,
      content.updatedAt,
      content.deletedAt ?? null,
    );
  }

  static convertListFromEntities(contents: GeneralEntity[]): GeneralResponse[] {
    return contents.map((content) => this.convertFromEntity(content)!);
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
      content.githubUrl,
      content.gitlabUrl,
      content.linkedinUrl,
      content.threadUrl,
      content.tiktokUrl,
      content.createdAt,
      content.updatedAt,
      content.deletedAt,
    );
  }
}
