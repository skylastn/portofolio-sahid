import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { AchievementRequest } from "../domain/model/request/achievement/achievement_request";
import { CreateAchievementRequest } from "../domain/model/request/achievement/create_achievement_request";
import { AchievementResponse } from "../domain/model/response/achievement_response";
import { AchievementRepository } from "../domain/repository/achievement_repository";
import { AchievementRemoteDataSource } from "../infrastructure/data_source/achievement_remote_data_source";
import { AchievementRepositoryImpl } from "../infrastructure/persistence/achievement_repository_impl";

export class AchievementService {
  private repo: AchievementRepository;

  constructor() {
    this.repo = new AchievementRepositoryImpl(new AchievementRemoteDataSource());
  }

  async fetchAchievements(
    query?: AchievementRequest,
  ): Promise<Either<ResponseModel, ResponseModel<AchievementResponse.Data[]>>> {
    return await this.repo.fetchAchievements(query);
  }

  async fetchAchievementById(
    id: string,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    return await this.repo.fetchAchievementById(id);
  }

  async createAchievement(
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    return await this.repo.createAchievement(request);
  }

  async updateAchievement(
    id: string,
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    return await this.repo.updateAchievement(id, request);
  }

  async deleteAchievement(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.repo.deleteAchievement(id);
  }
}
