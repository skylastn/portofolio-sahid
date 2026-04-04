import { Injectable, Inject } from '@nestjs/common';
import { MinioService } from '../../../support/application/minio_service';
import {
  PORTOFOLIO_IMAGE_DATABASE_REPOSITORY,
} from '../../domain/repository/database/portofolio/portofolio_image_database_repository';
import type { PortofolioImageDatabaseRepository } from '../../domain/repository/database/portofolio/portofolio_image_database_repository';
import { PortofolioImageEntity } from '../../domain/model/entities/portofolio/portofolio_image_entity';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { PortofolioImageResponse } from '../../domain/model/response/portofolio/portofolio_image_response';
import { MinioResponse } from '../../../support/domain/model/response/minio_response';
import { FileUtility } from '../../../../shared/utils/utility/file_utility';

@Injectable()
export class PortofolioImageService {
  constructor(
    @Inject(PORTOFOLIO_IMAGE_DATABASE_REPOSITORY)
    private repo: PortofolioImageDatabaseRepository,
    private minioService: MinioService,
  ) {}
  folderPath = 'portofolio/image';

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioImageEntity[]> {
    return await this.repo.findAllByPortofolioId(portofolioId);
  }

  async findAllByListIds(ids: string[]): Promise<PortofolioImageEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }

  async findAllByPortofolioIdAndListImagePath(
    portofolioId: string,
    listImagePath: string[],
  ): Promise<PortofolioImageEntity[]> {
    return await this.repo.findAllByPortofolioIdAndListImagePath(
      portofolioId,
      listImagePath,
    );
  }

  async findOneById(id: string): Promise<PortofolioImageEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<PortofolioImageResponse> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('PortofolioImage not found');
    }
    return await PortofolioImageResponse.convertFromEntity(
      find,
      this.minioService,
    );
  }

  async createOrUpdate(
    data: PortofolioImageEntity,
  ): Promise<PortofolioImageEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('PortofolioImage not found');
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

  async syncWithPortofolioIdAndListImagePath(
    portofolioId: string,
    listImagePath: string[],
    listDeletedImageId: string[],
  ): Promise<void> {
    if (FormatHelper.isNotEmpty(listDeletedImageId)) {
      await this.deleteAllByPortofolioIdAndListImageId(
        portofolioId,
        listDeletedImageId,
      );
    }
    if (!FormatHelper.isNotEmpty(listImagePath)) return;
    const existing = await this.findAllByPortofolioIdAndListImagePath(
      portofolioId,
      listImagePath,
    );

    const existingSet = new Set(existing.map((x) => x.imagePath));

    for (const imagePath of listImagePath) {
      if (existingSet.has(imagePath)) continue;
      const entity = new PortofolioImageEntity();
      entity.portofolioId = portofolioId;
      entity.imagePath = imagePath;
      await this.createOrUpdate(entity);
    }
  }

  async deleteAllByPortofolioIdAndListImageId(
    portofolioId: string,
    listDeletedImageId: string[],
  ): Promise<void> {
    if (!FormatHelper.isNotEmpty(listDeletedImageId)) return;
    const findAll = await this.findAllByPortofolioId(portofolioId);
    const existingSet = new Set(findAll.map((x) => x.id));
    for (const content of findAll) {
      if (!existingSet.has(content.id)) continue;
      await this.removeById(content.id);
    }
  }
}
