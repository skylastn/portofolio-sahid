import { Injectable, Inject } from '@nestjs/common';
import {
  GENERAL_DATABASE_REPOSITORY,
} from '../domain/repository/database/general_database_repository';
import type { GeneralDatabaseRepository } from '../domain/repository/database/general_database_repository';
import { GeneralEntity } from '../domain/model/entities/general_entity';
import { CreateGeneralRequest } from '../domain/model/request/general/create_general_request';
import { GeneralResponse } from '../domain/model/response/general_response';
import { MinioService } from '../../support/application/minio_service';
import { FileUtility } from '../../../shared/utils/utility/file_utility';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';

@Injectable()
export class GeneralService {
  constructor(
    @Inject(GENERAL_DATABASE_REPOSITORY)
    private repo: GeneralDatabaseRepository,
    private minioService: MinioService,
  ) {}

  folderPath = 'general';

  async findAll(): Promise<GeneralEntity[]> {
    return await this.repo.findAll();
  }

  async findAllResponse(): Promise<GeneralResponse[]> {
    const generals = await this.repo.findAll();
    return await GeneralResponse.convertListFromEntities(
      generals,
      this.minioService,
    );
  }

  async findOneById(id: string): Promise<GeneralEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<GeneralResponse | null> {
    const general = await this.repo.findOneById(id);
    return await GeneralResponse.convertFromEntity(general, this.minioService);
  }

  async createOrUpdate(data: GeneralEntity): Promise<GeneralEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.repo.findOneById(id);
    await this.repo.removeById(id);
    if (FormatHelper.isPresent(find?.cvPath)) {
      this.minioService.removeObject(find.cvPath);
    }
  }

  async createGeneral(
    data: CreateGeneralRequest,
  ): Promise<GeneralEntity | null> {
    return await this.repo.createOrUpdate(data.convertToEntity());
  }

  async createUploadSignature(fileName: string) {
    return await this.minioService.getPresignedUploadUrl(
      this.folderPath + `/${FileUtility.generateFileName(fileName)}`,
    );
  }

  async updateGeneral(
    id: string,
    data: CreateGeneralRequest,
  ): Promise<GeneralEntity | null> {
    const find = await this.repo.findOneById(id);
    if (!find) {
      throw new Error('General not found');
    }
    const oldCvPath = find.cvPath;
    Object.assign(find, data.convertToEntity());
    const result = await this.repo.createOrUpdate(find);
    if (
      result &&
      FormatHelper.isPresent(data.cv_path) &&
      FormatHelper.isPresent(oldCvPath) &&
      data.cv_path !== oldCvPath
    ) {
      this.minioService.removeObject(oldCvPath);
    }
    return result;
  }
}
