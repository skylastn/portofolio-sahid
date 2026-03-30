import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('portofolio_images')
export class PortofolioImageEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId: string;
  @Column({ type: 'text', name: 'image_path', nullable: true })
  imagePath: string;
}
