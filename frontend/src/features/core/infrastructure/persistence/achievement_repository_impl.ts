import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { AchievementRequest } from "../../domain/model/request/achievement/achievement_request";
import { CreateAchievementRequest } from "../../domain/model/request/achievement/create_achievement_request";
import { AchievementResponse } from "../../domain/model/response/achievement_response";
import { AchievementRepository } from "../../domain/repository/achievement_repository";
import { AchievementRemoteDataSource } from "../data_source/achievement_remote_data_source";

export class AchievementRepositoryImpl implements AchievementRepository {
  constructor(private readonly remote: AchievementRemoteDataSource) {}

  async fetchAchievements(
    query?: AchievementRequest,
  ): Promise<Either<ResponseModel, ResponseModel<AchievementResponse.Data[]>>> {
    return await this.remote.fetchAchievements(query);
  }

  async fetchAchievementById(
    id: string,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    return await this.remote.fetchAchievementById(id);
  }

  async createAchievement(
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    return await this.remote.createAchievement(request);
  }

  async updateAchievement(
    id: string,
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    return await this.remote.updateAchievement(id, request);
  }

  async deleteAchievement(id: string): Promise<Either<ResponseModel, boolean>> {
    return await this.remote.deleteAchievement(id);
  }
}
