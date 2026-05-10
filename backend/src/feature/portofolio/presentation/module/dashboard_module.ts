import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementEntity } from '../../domain/model/entities/achievement_entity';
import { CategoryEntity } from '../../domain/model/entities/category_entity';
import { CodeLanguageEntity } from '../../domain/model/entities/code_language_entity';
import { FrameworkEntity } from '../../domain/model/entities/framework_entity';
import { GeneralEntity } from '../../domain/model/entities/general_entity';
import { PortofolioEntity } from '../../domain/model/entities/portofolio/portofolio_entity';
import { WorkEntity } from '../../domain/model/entities/work/work_entity';
import { DashboardService } from '../../application/dashboard_service';
import { DashboardController } from '../controller/dashboard_controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PortofolioEntity,
      WorkEntity,
      AchievementEntity,
      CodeLanguageEntity,
      FrameworkEntity,
      CategoryEntity,
      GeneralEntity,
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
