import { TypeOrmModule } from '@nestjs/typeorm';
import { PortofolioAppsSourceService } from '../../../application/portofolio/portofolio_apps_source_service';
import { PortofolioAppsSourceEntity } from '../../../domain/model/entities/portofolio/portofolio_apps_source_entity';
import { PORTOFOLIO_APPS_SOURCE_DATABASE_REPOSITORY } from '../../../domain/repository/database/portofolio/portofolio_apps_source_database_repository';
import { PortofolioAppsSourceDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/portofolio/portofolio_apps_source_database_repository_impl';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([PortofolioAppsSourceEntity])],
  providers: [
    PortofolioAppsSourceService,
    {
      provide: PORTOFOLIO_APPS_SOURCE_DATABASE_REPOSITORY,
      useClass: PortofolioAppsSourceDatabaseRepositoryImpl,
    },
  ],
  exports: [PortofolioAppsSourceService],
  //   controllers: [PortofolioAppsSourceController],
})
export class PortofolioAppsSourceModule {}
