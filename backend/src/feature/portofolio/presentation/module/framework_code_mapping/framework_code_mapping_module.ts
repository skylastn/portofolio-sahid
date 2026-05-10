import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeLanguageModule } from '../code_language_module';
import { FrameworkCodeMappingService } from '../../../application/framework_code_mapping/framework_code_mapping_service';
import { FrameworkCodeMappingEntity } from '../../../domain/model/entities/framework_code_mapping_entity';
import { FRAMEWORK_CODE_MAPPING_DATABASE_REPOSITORY } from '../../../domain/repository/database/framework_code_mapping/framework_code_mapping_database_repository';
import { FrameworkCodeMappingDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/framework_code_mapping/framework_code_mapping_database_repository_impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrameworkCodeMappingEntity]),
    CodeLanguageModule,
  ],
  providers: [
    FrameworkCodeMappingService,
    {
      provide: FRAMEWORK_CODE_MAPPING_DATABASE_REPOSITORY,
      useClass: FrameworkCodeMappingDatabaseRepositoryImpl,
    },
  ],
  exports: [FrameworkCodeMappingService],
})
export class FrameworkCodeMappingModule {}
