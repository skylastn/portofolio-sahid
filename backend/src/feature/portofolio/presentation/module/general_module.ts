import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralService } from '../../application/general_service';
import { GeneralEntity } from '../../domain/model/entities/general_entity';
import { GENERAL_DATABASE_REPOSITORY } from '../../domain/repository/database/general_database_repository';
import { GeneralDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/general_database_repository_impl';
import { GeneralController } from '../controller/general_controller';
import { Module } from '@nestjs/common';
import { MinioModule } from '../../../support/presentation/module/minio_module';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralEntity]), MinioModule],
  providers: [
    GeneralService,
    {
      provide: GENERAL_DATABASE_REPOSITORY,
      useClass: GeneralDatabaseRepositoryImpl,
    },
  ],
  exports: [GeneralService],
  controllers: [GeneralController],
})
export class GeneralModule {}
