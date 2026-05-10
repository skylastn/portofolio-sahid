import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '../../../support/presentation/module/minio_module';
import { ToolService } from '../../application/tool_service';
import { ToolEntity } from '../../domain/model/entities/tool_entity';
import { TOOL_DATABASE_REPOSITORY } from '../../domain/repository/database/tool_database_repository';
import { ToolDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/tool_database_repository_impl';
import { ToolController } from '../controller/tool_controller';

@Module({
  imports: [TypeOrmModule.forFeature([ToolEntity]), MinioModule],
  providers: [
    ToolService,
    {
      provide: TOOL_DATABASE_REPOSITORY,
      useClass: ToolDatabaseRepositoryImpl,
    },
  ],
  exports: [ToolService],
  controllers: [ToolController],
})
export class ToolModule {}
