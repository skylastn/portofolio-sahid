import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';

@Entity('code_languages')
export class CodeLanguageEntity extends DefaultEntity {
  @Column()
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'image_path', type: 'text', nullable: true })
  imagePath: string | null;
}
