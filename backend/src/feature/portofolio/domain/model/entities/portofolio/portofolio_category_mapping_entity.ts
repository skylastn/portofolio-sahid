import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('portofolio_category_mapping')
export class PortofolioCategoryMappingEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId: string;
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;
}
