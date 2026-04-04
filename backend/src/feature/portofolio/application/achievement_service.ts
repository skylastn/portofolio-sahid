import { Injectable, Inject } from '@nestjs/common';
import { PaginationResponse } from '../../../shared/core/model/response/pagination_response';
import { FileUtility } from '../../../shared/utils/utility/file_utility';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { MinioService } from '../../support/application/minio_service';
import { MinioResponse } from '../../support/domain/model/response/minio_response';
import { AchievementEntity } from '../domain/model/entities/achievement_entity';
import { AchievementRequest } from '../domain/model/request/achievement/achievement_request';
import { CreateAchievementRequest } from '../domain/model/request/achievement/create_achievement_request';
import {
  ACHIEVEMENT_DATABASE_REPOSITORY,
} from '../domain/repository/database/achievement_database_repository';
import type { AchievementDatabaseRepository } from '../domain/repository/database/achievement_database_repository';
import { AchievementResponse } from '../domain/model/response/achievement_response';

@Injectable()
export class AchievementService {
  constructor(
    @Inject(ACHIEVEMENT_DATABASE_REPOSITORY)
    private repo: AchievementDatabaseRepository,
    private minioService: MinioService,
  ) {}
  folderPath = 'achievement';

  async findAllPagination(
    request: AchievementRequest,
  ): Promise<PaginationResponse<AchievementResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return PaginationResponse.map(
      paginationEntity,
      async (u) =>
        await AchievementResponse.convertFromEntity(u, this.minioService),
    );
  }

  async findAllByListId(ids: string[]): Promise<AchievementEntity[]> {
    return await this.repo.findAllByListId(ids);
  }

  async findOneById(id: string): Promise<AchievementEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<AchievementResponse | null> {
    const content = await this.findOneById(id);
    if (!FormatHelper.isPresent(content)) {
      throw new Error('Achievement not found');
    }
    return AchievementResponse.convertFromEntity(content, this.minioService);
  }

  async createOrUpdate(
    data: AchievementEntity,
  ): Promise<AchievementEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Achievement not found');
    }
    await this.repo.removeById(id);
    if (FormatHelper.isPresent(find.imagePath)) {
      this.minioService.removeObject(find.imagePath);
    }
  }

  async createUploadSignature(imageName: string): Promise<MinioResponse> {
    return await this.minioService.getPresignedUploadUrl(
      this.folderPath + `/${FileUtility.generateFileName(imageName)}`,
    );
  }

  async createAchievement(
    data: CreateAchievementRequest,
  ): Promise<AchievementEntity | null> {
    return await this.createOrUpdate(data.convertToEntity());
  }

  async updateAchievement(
    id: string,
    data: CreateAchievementRequest,
  ): Promise<AchievementEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Achievement not found');
    }
    const oldImagePath = find.imagePath;
    Object.assign(find, data.convertToEntity());
    const result = await this.createOrUpdate(find);
    if (
      result &&
      FormatHelper.isPresent(data.image_path) &&
      FormatHelper.isPresent(oldImagePath)
    ) {
      this.minioService.removeObject(oldImagePath);
    }
    return result;
  }
}
