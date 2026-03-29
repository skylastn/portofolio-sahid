import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('portofolio_framework_mapping')
export class PortofolioFrameworkMappingEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId: string;
  @Column({ name: 'framework_id', type: 'uuid' })
  frameworkId: string;
}
