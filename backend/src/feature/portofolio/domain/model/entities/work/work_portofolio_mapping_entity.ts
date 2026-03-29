import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('work_portofolio_mapping')
export class WorkPortofolioMappingEntity extends DefaultEntity {
  @Column({ name: 'work_id', type: 'uuid' })
  workId: string;
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId: string;
}
