import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '../../../../support/presentation/module/minio_module';
import { PortofolioService } from '../../../application/portofolio/portofolio_service';
import { PortofolioEntity } from '../../../domain/model/entities/portofolio/portofolio_entity';
import { PORTOFOLIO_DATABASE_REPOSITORY } from '../../../domain/repository/database/portofolio/portofolio_database_repository';
import { PortofolioDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/portofolio/portofolio_database_repository_impl';
import { PortofolioImageModule } from './portofolio_image_module';
import { PortofolioAppsSourceModule } from './portofolio_apps_source_module';
import { PortofolioCategoryMappingModule } from './portofolio_category_mapping_module';
import { PortofolioFrameworkMappingModule } from './portofolio_framework_mapping_module';
import { PortofolioController } from '../../controller/portofolio/portofolio_controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PortofolioEntity]),
    MinioModule,
    PortofolioAppsSourceModule,
    PortofolioImageModule,
    PortofolioCategoryMappingModule,
    PortofolioFrameworkMappingModule,
  ],
  providers: [
    PortofolioService,
    {
      provide: PORTOFOLIO_DATABASE_REPOSITORY,
      useClass: PortofolioDatabaseRepositoryImpl,
    },
  ],
  exports: [PortofolioService],
  controllers: [PortofolioController],
})
export class PortofolioModule {}
