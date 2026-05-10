import { TypeOrmModule } from '@nestjs/typeorm';
import { PortofolioFrameworkMappingService } from '../../../application/portofolio/portofolio_framework_mapping_service';
import { PortofolioFrameworkMappingEntity } from '../../../domain/model/entities/portofolio/portofolio_framework_mapping_entity';
import { PORTOFOLIO_FRAMEWORK_MAPPING_DATABASE_REPOSITORY } from '../../../domain/repository/database/portofolio/portofolio_framework_mapping_database_repository';
import { PortofolioFrameworkMappingDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/portofolio/portofolio_framework_mapping_database_repository_impl';
import { FrameworkModule } from '../framework_module';
import { Module } from '@nestjs/common';
import { MinioModule } from '../../../../support/presentation/module/minio_module';
import { FrameworkCodeMappingModule } from '../framework_code_mapping/framework_code_mapping_module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PortofolioFrameworkMappingEntity]),
    FrameworkModule,
    FrameworkCodeMappingModule,
    MinioModule,
  ],
  providers: [
    PortofolioFrameworkMappingService,
    {
      provide: PORTOFOLIO_FRAMEWORK_MAPPING_DATABASE_REPOSITORY,
      useClass: PortofolioFrameworkMappingDatabaseRepositoryImpl,
    },
  ],
  exports: [PortofolioFrameworkMappingService],
  //   controllers: [PortofolioFrameworkMappingController],
})
export class PortofolioFrameworkMappingModule {}
