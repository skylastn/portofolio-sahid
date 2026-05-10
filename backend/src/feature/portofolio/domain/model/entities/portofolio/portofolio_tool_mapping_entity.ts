import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';
import { ToolEntity } from '../tool_entity';

@Entity('portofolio_tool_mapping')
export class PortofolioToolMappingEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId!: string;

  @Column({ name: 'tool_id', type: 'uuid' })
  toolId!: string;

  @ManyToOne(() => ToolEntity)
  @JoinColumn({
    name: 'tool_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_portofolio_tool_mapping_tool_id',
  })
  tool!: ToolEntity;
}
