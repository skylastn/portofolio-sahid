import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortofolioToolMappingService } from '../../../application/portofolio/portofolio_tool_mapping_service';
import { PortofolioToolMappingEntity } from '../../../domain/model/entities/portofolio/portofolio_tool_mapping_entity';
import { PORTOFOLIO_TOOL_MAPPING_DATABASE_REPOSITORY } from '../../../domain/repository/database/portofolio/portofolio_tool_mapping_database_repository';
import { PortofolioToolMappingDatabaseRepositoryImpl } from '../../../infrastructure/persistence/database/portofolio/portofolio_tool_mapping_database_repository_impl';
import { ToolModule } from '../tool_module';

@Module({
  imports: [TypeOrmModule.forFeature([PortofolioToolMappingEntity]), ToolModule],
  providers: [
    PortofolioToolMappingService,
    {
      provide: PORTOFOLIO_TOOL_MAPPING_DATABASE_REPOSITORY,
      useClass: PortofolioToolMappingDatabaseRepositoryImpl,
    },
  ],
  exports: [PortofolioToolMappingService],
})
export class PortofolioToolMappingModule {}
