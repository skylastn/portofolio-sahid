import { Module } from '@nestjs/common';
import { PORTOFOLIO_CATEGORY_MAPPING_DATABASE_REPOSITORY } from '../../../domain/repository/database/portofolio/portofolio_category_mapping_database_repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortofolioCategoryMappingService } from '../../../application/portofolio/portofolio_category_mapping_service';
import { PortofolioCategoryMappingEntity } from '../../../domain/model/entities/portofolio/portofolio_category_mapping_entity';
import { PortofolioCategoryMappingDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/portofolio/portofolio_category_mapping_database_repository_impl';
import { CategoryModule } from '../category_module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PortofolioCategoryMappingEntity]),
    CategoryModule,
  ],
  providers: [
    PortofolioCategoryMappingService,
    {
      provide: PORTOFOLIO_CATEGORY_MAPPING_DATABASE_REPOSITORY,
      useClass: PortofolioCategoryMappingDatabaseRepositoryImpl,
    },
  ],
  exports: [PortofolioCategoryMappingService],
  //   controllers: [PortofolioCategoryMappingController],
})
export class PortofolioCategoryMappingModule {}
