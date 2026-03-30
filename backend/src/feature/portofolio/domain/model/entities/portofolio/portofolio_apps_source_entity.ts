import { Entity, Column } from 'typeorm';
import { AppSourceType } from '../../enum/apps_source_type';
import { DefaultEntity } from '../../../../../../shared/core/model/default_entity';

@Entity('portofolio_apps_sources')
export class PortofolioAppsSourceEntity extends DefaultEntity {
  @Column({ name: 'portofolio_id', type: 'uuid' })
  portofolioId: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'enum', enum: AppSourceType, default: AppSourceType.web })
  type: AppSourceType;
}
