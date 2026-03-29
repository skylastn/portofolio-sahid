import { Module } from '@nestjs/common';
import { CODE_LANGUAGE_DATABASE_REPOSITORY } from '../../domain/repository/database/code_language_database_repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeLanguageService } from '../../application/code_language_service';
import { CodeLanguageEntity } from '../../domain/model/entities/code_language_entity';
import { CodeLanguageDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/code_language_database_repository_impl';
import { CodeLanguageController } from '../controller/code_language_controller';
import { MinioModule } from '../../../support/presentation/module/minio_module';

@Module({
  imports: [TypeOrmModule.forFeature([CodeLanguageEntity]), MinioModule],
  providers: [
    CodeLanguageService,
    {
      provide: CODE_LANGUAGE_DATABASE_REPOSITORY,
      useClass: CodeLanguageDatabaseRepositoryImpl,
    },
  ],
  exports: [CodeLanguageService],
  controllers: [CodeLanguageController],
})
export class CodeLanguageModule {}
