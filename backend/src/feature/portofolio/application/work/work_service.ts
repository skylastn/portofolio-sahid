import { Injectable, Inject } from '@nestjs/common';
import { MinioService } from '../../../support/application/minio_service';
import { WORK_DATABASE_REPOSITORY } from '../../domain/repository/database/work/work_database_repository';
import type { WorkDatabaseRepository } from '../../domain/repository/database/work/work_database_repository';
import { PaginationResponse } from '../../../../shared/core/model/response/pagination_response';
import { WorkEntity } from '../../domain/model/entities/work/work_entity';
import { WorkRequest } from '../../domain/model/request/work/work_request';
import { WorkResponse } from '../../domain/model/response/work/work_response';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { FileUtility } from '../../../../shared/utils/utility/file_utility';
import { MinioResponse } from '../../../support/domain/model/response/minio_response';
import { CreateWorkRequest } from '../../domain/model/request/work/create_work_request';
import { syncEntityPosition } from '../sortable_position_service';

@Injectable()
export class WorkService {
  constructor(
    @Inject(WORK_DATABASE_REPOSITORY)
    private repo: WorkDatabaseRepository,
    private minioService: MinioService,
  ) {}
  folderPath = 'work';

  async findAllPagination(
    request: WorkRequest,
  ): Promise<PaginationResponse<WorkResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return await PaginationResponse.map(
      paginationEntity,
      async (u) => await WorkResponse.convertFromEntity(u, this.minioService),
    );
  }

  async findOneById(id: string): Promise<WorkEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<WorkResponse | null> {
    const work = await this.findOneById(id);
    if (!FormatHelper.isPresent(work)) {
      throw new Error('Work not found');
    }
    return await WorkResponse.convertFromEntity(work, this.minioService);
  }

  async createOrUpdate(data: WorkEntity): Promise<WorkEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Work not found');
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

  async createWork(data: CreateWorkRequest): Promise<WorkEntity | null> {
    return await syncEntityPosition(
      this.repo,
      data.convertToEntity(),
      data.position,
    );
  }

  async updateWork(
    id: string,
    data: CreateWorkRequest,
  ): Promise<WorkEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Work not found');
    }
    const oldImagePath = find.imagePath;
    const entity = data.convertToEntity();
    if (data.position == null) {
      entity.position = find.position;
    }
    Object.assign(find, entity);
    const result =
      data.position == null
        ? await this.createOrUpdate(find)
        : await syncEntityPosition(this.repo, find, data.position);
    if (
      result &&
      FormatHelper.isPresent(data.image_path) &&
      FormatHelper.isPresent(oldImagePath) &&
      data.image_path !== oldImagePath
    ) {
      this.minioService.removeObject(oldImagePath);
    }
    return result;
  }
}
