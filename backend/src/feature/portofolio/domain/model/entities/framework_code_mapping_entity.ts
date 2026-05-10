import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';
import { CodeLanguageEntity } from './code_language_entity';
import { FrameworkEntity } from './framework_entity';

@Entity('framework_code_mapping')
export class FrameworkCodeMappingEntity extends DefaultEntity {
  @Column({ name: 'framework_id', type: 'uuid' })
  frameworkId!: string;

  @Column({ name: 'code_language_id', type: 'uuid' })
  codeLanguageId!: string;

  @ManyToOne(() => FrameworkEntity)
  @JoinColumn({
    name: 'framework_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_framework_code_mapping_framework_id',
  })
  framework!: FrameworkEntity;

  @ManyToOne(() => CodeLanguageEntity)
  @JoinColumn({
    name: 'code_language_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_framework_code_mapping_code_language_id',
  })
  codeLanguage!: CodeLanguageEntity;
}
