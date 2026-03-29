import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('portofolios')
export class PortofolioEntity extends DefaultEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  // @Column({ type: 'text',  })
  // imagePath: string;
}
