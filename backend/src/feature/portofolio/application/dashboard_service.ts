import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementEntity } from '../domain/model/entities/achievement_entity';
import { CategoryEntity } from '../domain/model/entities/category_entity';
import { CodeLanguageEntity } from '../domain/model/entities/code_language_entity';
import { FrameworkEntity } from '../domain/model/entities/framework_entity';
import { GeneralEntity } from '../domain/model/entities/general_entity';
import { PortofolioEntity } from '../domain/model/entities/portofolio/portofolio_entity';
import {
  WorkEntity,
  WorkType,
} from '../domain/model/entities/work/work_entity';
import {
  DashboardLatestItemResponse,
  DashboardLatestResponse,
  DashboardSummaryResponse,
  DashboardTotalsResponse,
  DashboardWorkTypesResponse,
} from '../domain/model/response/dashboard_response';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(PortofolioEntity)
    private readonly portofolioRepo: Repository<PortofolioEntity>,
    @InjectRepository(WorkEntity)
    private readonly workRepo: Repository<WorkEntity>,
    @InjectRepository(AchievementEntity)
    private readonly achievementRepo: Repository<AchievementEntity>,
    @InjectRepository(CodeLanguageEntity)
    private readonly codeLanguageRepo: Repository<CodeLanguageEntity>,
    @InjectRepository(FrameworkEntity)
    private readonly frameworkRepo: Repository<FrameworkEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(GeneralEntity)
    private readonly generalRepo: Repository<GeneralEntity>,
  ) {}

  async summary(): Promise<DashboardSummaryResponse> {
    const [
      portofolios,
      works,
      freelanceWorks,
      fulltimeWorks,
      achievements,
      codeLanguages,
      frameworks,
      categories,
      generals,
      latestPortofolio,
      latestWork,
      latestAchievement,
    ] = await Promise.all([
      this.portofolioRepo.count(),
      this.workRepo.count(),
      this.workRepo.count({ where: { type: WorkType.FREELANCE } }),
      this.workRepo.count({ where: { type: WorkType.FULLTIME } }),
      this.achievementRepo.count(),
      this.codeLanguageRepo.count(),
      this.frameworkRepo.count(),
      this.categoryRepo.count(),
      this.generalRepo.count(),
      this.portofolioRepo.findOne({ where: {}, order: { updatedAt: 'DESC' } }),
      this.workRepo.findOne({ where: {}, order: { updatedAt: 'DESC' } }),
      this.achievementRepo.findOne({ where: {}, order: { updatedAt: 'DESC' } }),
    ]);

    return new DashboardSummaryResponse(
      new DashboardTotalsResponse(
        portofolios,
        works,
        achievements,
        codeLanguages,
        frameworks,
        categories,
        generals,
      ),
      new DashboardWorkTypesResponse(freelanceWorks, fulltimeWorks),
      new DashboardLatestResponse(
        latestPortofolio
          ? new DashboardLatestItemResponse(
              latestPortofolio.id,
              latestPortofolio.title,
              latestPortofolio.updatedAt,
            )
          : null,
        latestWork
          ? new DashboardLatestItemResponse(
              latestWork.id,
              latestWork.jobTitle,
              latestWork.updatedAt,
              latestWork.type,
            )
          : null,
        latestAchievement
          ? new DashboardLatestItemResponse(
              latestAchievement.id,
              latestAchievement.title,
              latestAchievement.updatedAt,
            )
          : null,
      ),
    );
  }
}
