import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

export enum WorkType {
  FREELANCE = 'freelance',
  FULLTIME = 'fulltime',
}

@Entity('works')
export class WorkEntity extends DefaultEntity {
  @Column({ type: 'enum', enum: WorkType, default: WorkType.FULLTIME })
  type!: WorkType;

  @Column({ type: 'text', name: 'company_name' })
  companyName!: string;

  @Column({ type: 'text', name: 'company_url', nullable: true })
  companyUrl?: string | null;

  @Column({ type: 'varchar', name: 'job_title', length: 50 })
  jobTitle!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate?: Date | null;

  @Column({ type: 'text', name: 'image_path', nullable: true })
  imagePath?: string | null;

  @Column({ name: 'position', type: 'int', default: 0 })
  position!: number;
}
