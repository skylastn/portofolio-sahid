import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';

@Entity('categories')
export class CategoryEntity extends DefaultEntity {
  @Column()
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
}
