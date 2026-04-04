import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';
import { FrameworkEntity } from '../framework_entity';

@Entity('portofolio_framework_mapping')
export class PortofolioFrameworkMappingEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId!: string;
  @Column({ name: 'framework_id', type: 'uuid' })
  frameworkId!: string;

  @ManyToOne(() => FrameworkEntity)
  @JoinColumn({
    name: 'framework_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_portofolio_framework_mapping_framework_id',
  })
  framework!: FrameworkEntity;
}
