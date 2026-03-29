import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { GeneralEntity } from '../../entities/general_entity';

export class CreateGeneralRequest {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEmail()
  email: string;

  @IsString()
  github_url: string;

  @IsString()
  gitlab_url: string;

  @IsString()
  linkedin_url: string;

  @IsString()
  thread_url: string;

  @IsString()
  tiktok_url: string;

  convertToEntity(): GeneralEntity {
    const entity = new GeneralEntity();
    entity.title = this.title;
    entity.description = this.description;
    entity.email = this.email;
    entity.githubUrl = this.github_url;
    entity.gitlabUrl = this.gitlab_url;
    entity.linkedinUrl = this.linkedin_url;
    entity.threadUrl = this.thread_url;
    entity.tiktokUrl = this.tiktok_url;
    return entity;
  }
}
