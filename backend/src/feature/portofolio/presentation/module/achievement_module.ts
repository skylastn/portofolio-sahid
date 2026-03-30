import { Module } from '@nestjs/common';
import { ACHIEVEMENT_DATABASE_REPOSITORY } from '../../domain/repository/database/achievement_database_repository';
import { AchievementDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/achievement_database_repository_impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from '../../../support/presentation/module/minio_module';
import { AchievementService } from '../../application/achievement_service';
import { AchievementEntity } from '../../domain/model/entities/achievement_entity';
import { AchievementController } from '../controller/achievement_controller';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementEntity]), MinioModule],
  providers: [
    AchievementService,
    {
      provide: ACHIEVEMENT_DATABASE_REPOSITORY,
      useClass: AchievementDatabaseRepositoryImpl,
    },
  ],
  exports: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
