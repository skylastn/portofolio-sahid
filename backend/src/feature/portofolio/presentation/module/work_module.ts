import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkService } from '../../application/work/work_service';
import { WorkEntity } from '../../domain/model/entities/work/work_entity';
import { WORK_DATABASE_REPOSITORY } from '../../domain/repository/database/work/work_database_repository';
import { WorkDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/work/work_database_repository_impl';
import { MinioModule } from '../../../support/presentation/module/minio_module';
import { WorkController } from '../controller/work_controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkEntity]), MinioModule],
  providers: [
    WorkService,
    {
      provide: WORK_DATABASE_REPOSITORY,
      useClass: WorkDatabaseRepositoryImpl,
    },
  ],
  exports: [WorkService],
  controllers: [WorkController],
})
export class WorkModule {}
