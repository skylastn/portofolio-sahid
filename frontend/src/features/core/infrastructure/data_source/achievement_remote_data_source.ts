import { UrlPath } from "@/shared/constant/url_path";
import { HttpMethod } from "@/shared/domain/model/enum/http_method";
import { ResponseModel } from "@/shared/domain/model/response_model";
import { MinioUploadResponse } from "@/shared/domain/model/response/minio_upload_response";
import { ApiClient } from "@/shared/network/api_client";
import { Either, left, right } from "@/shared/utils/utility/either";
import { AchievementRequest } from "../../domain/model/request/achievement/achievement_request";
import { CreateAchievementRequest } from "../../domain/model/request/achievement/create_achievement_request";
import { AchievementResponse } from "../../domain/model/response/achievement_response";

export class AchievementRemoteDataSource {
  constructor(private api = new ApiClient()) {}

  async createUploadSignature(
    imageName: string,
  ): Promise<Either<ResponseModel, MinioUploadResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.ACHIEVEMENT}/upload-signature`,
        method: HttpMethod.POST,
        data: { image_name: imageName },
      });
      if (response.status == false) return left(response);
      const parsed = MinioUploadResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async fetchAchievements(
    query?: AchievementRequest,
  ): Promise<Either<ResponseModel, ResponseModel<AchievementResponse.Data[]>>> {
    try {
      const response = await this.api.request({
        path: UrlPath.ACHIEVEMENT,
        method: HttpMethod.GET,
        params: {
          page: query?.page,
          perPage: query?.perPage,
          search: query?.search,
        },
      });
      if (response.status == false) return left(response);
      const parsed = AchievementResponse.ConvertList.fromJson(JSON.stringify(response));
      const result = new ResponseModel<AchievementResponse.Data[]>();
      result.status = !!parsed.status;
      result.message = parsed.message;
      result.total = parsed.total;
      result.perPage = parsed.perPage;
      result.currentPage = parsed.currentPage;
      result.data = parsed.data ?? [];
      return right(result);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async fetchAchievementById(
    id: string,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.ACHIEVEMENT}/${id}`,
        method: HttpMethod.GET,
      });
      if (response.status == false) return left(response);
      const parsed = AchievementResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async createAchievement(
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    try {
      const response = await this.api.request({
        path: UrlPath.ACHIEVEMENT,
        method: HttpMethod.POST,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = AchievementResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async updateAchievement(
    id: string,
    request: CreateAchievementRequest,
  ): Promise<Either<ResponseModel, AchievementResponse.Data>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.ACHIEVEMENT}/${id}`,
        method: HttpMethod.PUT,
        data: request,
      });
      if (response.status == false) return left(response);
      const parsed = AchievementResponse.Convert.fromJson(JSON.stringify(response));
      return right(parsed.data!);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }

  async deleteAchievement(id: string): Promise<Either<ResponseModel, boolean>> {
    try {
      const response = await this.api.request({
        path: `${UrlPath.ACHIEVEMENT}/${id}`,
        method: HttpMethod.DELETE,
      });
      if (response.status == false) return left(response);
      return right(true);
    } catch (error) {
      return left(ResponseModel.fromError(error));
    }
  }
}
