import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';
import { CategoryEntity } from '../category_entity';

@Entity('portofolio_category_mapping')
export class PortofolioCategoryMappingEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId!: string;
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_portofolio_category_mapping_category_id',
  })
  category!: CategoryEntity;
}
