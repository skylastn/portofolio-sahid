import { ResponseModel } from "@/shared/domain/model/response_model";
import { Either } from "@/shared/utils/utility/either";
import { AchievementRequest } from "../model/request/achievement/achievement_request";
import { CreateAchievementRequest } from "../model/request/achievement/create_achievement_request";
import { AchievementResponse } from "../model/response/achievement_response";

export interface AchievementRepository {
  fetchAchievements(
    query?: AchievementRequest,
  ): Promise<Either<ResponseModel, ResponseModel<AchievementResponse.Data[]>>>;
  fetchAchievementById(
    id: string,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>>;
  createAchievement(
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>>;
  updateAchievement(
    id: string,
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>>;
  deleteAchievement(id: string): Promise<Either<ResponseModel, boolean>>;
}
