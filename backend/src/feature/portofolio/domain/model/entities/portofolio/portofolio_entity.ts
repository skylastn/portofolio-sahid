import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';
import { WorkEntity } from '../work/work_entity';

@Entity('portofolios')
export class PortofolioEntity extends DefaultEntity {
  @Column({ name: 'work_id', type: 'uuid', nullable: true })
  workId?: string | null;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', name: 'thumbnail_path', nullable: true })
  thumbnailPath?: string | null;

  @ManyToOne(() => WorkEntity)
  @JoinColumn({
    name: 'work_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_portofolio_work_id',
  })
  work?: WorkEntity | null;
}
