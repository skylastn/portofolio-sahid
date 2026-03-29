import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('works')
export class WorkEntity extends DefaultEntity {
  @Column({ type: 'varchar', name: 'job_title', length: 50 })
  jobTitle: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: string;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text' })
  appstoreUrl: string;

  @Column({ type: 'text', nullable: true })
  githubUrl: string | null;

  @Column({ type: 'text' })
  imagePath: string;
}
