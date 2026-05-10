import { FrameworkCodeMappingEntity } from '../../../model/entities/framework_code_mapping_entity';

export const FRAMEWORK_CODE_MAPPING_DATABASE_REPOSITORY =
  'FRAMEWORK_CODE_MAPPING_DATABASE_REPOSITORY';

export interface FrameworkCodeMappingDatabaseRepository {
  findAllByFrameworkId(
    frameworkId: string,
  ): Promise<FrameworkCodeMappingEntity[]>;
  findAllByFrameworkIdAndListCodeLanguageId(
    frameworkId: string,
    listCodeLanguageId: string[],
  ): Promise<FrameworkCodeMappingEntity[]>;
  findOneById(id: string): Promise<FrameworkCodeMappingEntity | null>;
  createOrUpdate(
    data: FrameworkCodeMappingEntity,
  ): Promise<FrameworkCodeMappingEntity | null>;
  removeById(id: string): Promise<void>;
}
