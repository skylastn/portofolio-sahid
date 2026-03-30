import { Module } from '@nestjs/common';
import { PORTOFOLIO_IMAGE_DATABASE_REPOSITORY } from '../../../domain/repository/database/portofolio/portofolio_image_database_repository';
import { PortofolioImageDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/portofolio/portofolio_image_database_repository_impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortofolioImageService } from '../../../application/portofolio/portofolio_image_service';
import { PortofolioImageEntity } from '../../../domain/model/entities/portofolio/portofolio_image_entity';
import { MinioModule } from '../../../../support/presentation/module/minio_module';

@Module({
  imports: [TypeOrmModule.forFeature([PortofolioImageEntity]), MinioModule],
  providers: [
    PortofolioImageService,
    {
      provide: PORTOFOLIO_IMAGE_DATABASE_REPOSITORY,
      useClass: PortofolioImageDatabaseRepositoryImpl,
    },
  ],
  exports: [PortofolioImageService],
  //   controllers: [PortofolioImageController],
})
export class PortofolioImageModule {}
