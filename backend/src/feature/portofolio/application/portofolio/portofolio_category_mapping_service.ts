import { Injectable, Inject } from '@nestjs/common';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { MinioService } from '../../../support/application/minio_service';
import { PortofolioCategoryMappingEntity } from '../../domain/model/entities/portofolio/portofolio_category_mapping_entity';
import { PortofolioCategoryMappingResponse } from '../../domain/model/response/portofolio/portofolio_category_mapping_response';
import {
  PORTOFOLIO_CATEGORY_MAPPING_DATABASE_REPOSITORY,
} from '../../domain/repository/database/portofolio/portofolio_category_mapping_database_repository';
import type { PortofolioCategoryMappingDatabaseRepository } from '../../domain/repository/database/portofolio/portofolio_category_mapping_database_repository';
import { CategoryService } from '../category_service';

@Injectable()
export class PortofolioCategoryMappingService {
  constructor(
    @Inject(PORTOFOLIO_CATEGORY_MAPPING_DATABASE_REPOSITORY)
    private repo: PortofolioCategoryMappingDatabaseRepository,
    private categoryService: CategoryService,
  ) {}

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioCategoryMappingEntity[]> {
    return await this.repo.findAllByPortofolioId(portofolioId);
  }

  async findAllByListIds(
    ids: string[],
  ): Promise<PortofolioCategoryMappingEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }
  async findAllByPortofolioIdAndListCategoryId(
    portofolioId: string,
    listCategoryId: string[],
  ): Promise<PortofolioCategoryMappingEntity[]> {
    return await this.repo.findAllByPortofolioIdAndListCategoryId(
      portofolioId,
      listCategoryId,
    );
  }
  async findOneById(
    id: string,
  ): Promise<PortofolioCategoryMappingEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(
    id: string,
  ): Promise<PortofolioCategoryMappingResponse | null> {
    const portofolioCategoryMapping = await this.findOneById(id);
    if (!FormatHelper.isPresent(portofolioCategoryMapping)) {
      throw new Error('PortofolioCategoryMapping not found');
    }
    return PortofolioCategoryMappingResponse.convertFromEntity(
      portofolioCategoryMapping,
    );
  }

  async createOrUpdate(
    data: PortofolioCategoryMappingEntity,
  ): Promise<PortofolioCategoryMappingEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async syncWithPortofolioIdAndListCategoryId(
    portofolioId: string,
    listCategoryId: string[],
    listDeletedCategoryId: string[],
  ): Promise<void> {
    if (FormatHelper.isNotEmpty(listDeletedCategoryId)) {
      await this.deleteAllByPortofolioIdAndListCategoryId(
        portofolioId,
        listDeletedCategoryId,
      );
    }
    if (!FormatHelper.isNotEmpty(listCategoryId)) return;
    const existing = await this.findAllByPortofolioIdAndListCategoryId(
      portofolioId,
      listCategoryId,
    );

    const existingSet = new Set(existing.map((x) => x.categoryId));

    for (const categoryId of listCategoryId) {
      if (existingSet.has(categoryId)) continue;
      const find = await this.categoryService.findOneById(categoryId);
      if (!FormatHelper.isPresent(find)) {
        throw new Error('Category not found');
      }
      const entity = new PortofolioCategoryMappingEntity();
      entity.portofolioId = portofolioId;
      entity.categoryId = categoryId;
      await this.createOrUpdate(entity);
    }
  }

  async deleteAllByPortofolioIdAndListCategoryId(
    portofolioId: string,
    listDeletedCategoryId: string[],
  ): Promise<void> {
    if (!FormatHelper.isNotEmpty(listDeletedCategoryId)) return;
    const findAll = await this.findAllByPortofolioIdAndListCategoryId(
      portofolioId,
      listDeletedCategoryId,
    );
    for (const content of findAll) {
      await this.removeById(content.id);
    }
  }
}
