import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';

@Entity('frameworks')
export class FrameworkEntity extends DefaultEntity {
  @Column({ name: 'code_language_id', type: 'uuid' })
  codeLanguageId: string;

  @Column()
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'image_path', type: 'text', nullable: true })
  imagePath: string | null;
}
