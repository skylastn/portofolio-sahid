import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';

@Entity('tools')
export class ToolEntity extends DefaultEntity {
  @Column()
  title!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'position', type: 'int', default: 0 })
  position!: number;
}
