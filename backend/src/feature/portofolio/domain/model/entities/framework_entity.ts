import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';
import { CodeLanguageEntity } from './code_language_entity';
import { FrameworkCodeMappingEntity } from './framework_code_mapping_entity';

@Entity('frameworks')
export class FrameworkEntity extends DefaultEntity {
  @Column({ name: 'code_language_id', type: 'uuid' })
  codeLanguageId!: string;

  @ManyToOne(() => CodeLanguageEntity)
  @JoinColumn({
    name: 'code_language_id',
    referencedColumnName: 'id',
  })
  codeLanguage!: CodeLanguageEntity;

  @Column()
  title!: string;

  @Column({ name: 'description' })
  description!: string;

  @Column({ name: 'image_path', type: 'text', nullable: true })
  imagePath?: string | null;

  @Column({ name: 'position', type: 'int', default: 0 })
  position!: number;

  @OneToMany(() => FrameworkCodeMappingEntity, (mapping) => mapping.framework)
  codeLanguageMappings?: FrameworkCodeMappingEntity[];
}
