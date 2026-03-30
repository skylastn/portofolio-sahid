import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '../../../support/presentation/module/minio_module';
import { FrameworkService } from '../../application/framework_service';
import { FrameworkEntity } from '../../domain/model/entities/framework_entity';
import { FRAMEWORK_DATABASE_REPOSITORY } from '../../domain/repository/database/framework_database_repository';
import { FrameworkDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/framework_database_repository_impl';
import { FrameworkController } from '../controller/framework_controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([FrameworkEntity]), MinioModule],
  providers: [
    FrameworkService,
    {
      provide: FRAMEWORK_DATABASE_REPOSITORY,
      useClass: FrameworkDatabaseRepositoryImpl,
    },
  ],
  exports: [FrameworkService],
  controllers: [FrameworkController],
})
export class FrameworkModule {}
