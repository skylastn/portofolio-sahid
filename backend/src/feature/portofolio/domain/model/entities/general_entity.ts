import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';

@Entity('generals')
export class GeneralEntity extends DefaultEntity {
  @Column()
  title!: string;

  @Column({ name: 'description', type: 'text' })
  description!: string;

  @Column({ name: 'email' })
  email!: string;

  @Column({ name: 'github_url', type: 'text' })
  githubUrl!: string;

  @Column({ name: 'gitlab_url', type: 'text' })
  gitlabUrl!: string;

  @Column({ name: 'linkedin_url', type: 'text' })
  linkedinUrl!: string;

  @Column({ name: 'thread_url', type: 'text' })
  threadUrl!: string;

  @Column({ name: 'tiktok_url', type: 'text' })
  tiktokUrl!: string;

  @Column({ name: 'cv_path', type: 'text', nullable: true })
  cvPath?: string | null;
}
