import { Inject, Injectable } from '@nestjs/common';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { CodeLanguageService } from '../code_language_service';
import { FrameworkCodeMappingEntity } from '../../domain/model/entities/framework_code_mapping_entity';
import { FRAMEWORK_CODE_MAPPING_DATABASE_REPOSITORY } from '../../domain/repository/database/framework_code_mapping/framework_code_mapping_database_repository';
import type { FrameworkCodeMappingDatabaseRepository } from '../../domain/repository/database/framework_code_mapping/framework_code_mapping_database_repository';

@Injectable()
export class FrameworkCodeMappingService {
  constructor(
    @Inject(FRAMEWORK_CODE_MAPPING_DATABASE_REPOSITORY)
    private repo: FrameworkCodeMappingDatabaseRepository,
    private codeLanguageService: CodeLanguageService,
  ) {}

  async findAllByFrameworkId(
    frameworkId: string,
  ): Promise<FrameworkCodeMappingEntity[]> {
    return await this.repo.findAllByFrameworkId(frameworkId);
  }

  async findAllByFrameworkIdAndListCodeLanguageId(
    frameworkId: string,
    listCodeLanguageId: string[],
  ): Promise<FrameworkCodeMappingEntity[]> {
    return await this.repo.findAllByFrameworkIdAndListCodeLanguageId(
      frameworkId,
      listCodeLanguageId,
    );
  }

  async createOrUpdate(
    data: FrameworkCodeMappingEntity,
  ): Promise<FrameworkCodeMappingEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async syncWithFrameworkIdAndListCodeLanguageId(
    frameworkId: string,
    listCodeLanguageId: string[],
    listDeletedCodeLanguageId: string[],
  ): Promise<void> {
    if (FormatHelper.isNotEmpty(listDeletedCodeLanguageId)) {
      await this.deleteAllByFrameworkIdAndListCodeLanguageId(
        frameworkId,
        listDeletedCodeLanguageId,
      );
    }

    if (!FormatHelper.isNotEmpty(listCodeLanguageId)) return;

    const existing = await this.findAllByFrameworkIdAndListCodeLanguageId(
      frameworkId,
      listCodeLanguageId,
    );
    const existingSet = new Set(existing.map((item) => item.codeLanguageId));

    for (const codeLanguageId of listCodeLanguageId) {
      if (existingSet.has(codeLanguageId)) continue;

      const find = await this.codeLanguageService.findOneById(codeLanguageId);
      if (!FormatHelper.isPresent(find)) {
        throw new Error('CodeLanguage not found');
      }

      const entity = new FrameworkCodeMappingEntity();
      entity.frameworkId = frameworkId;
      entity.codeLanguageId = codeLanguageId;
      await this.createOrUpdate(entity);
    }
  }

  async deleteAllByFrameworkIdAndListCodeLanguageId(
    frameworkId: string,
    listDeletedCodeLanguageId: string[],
  ): Promise<void> {
    if (!FormatHelper.isNotEmpty(listDeletedCodeLanguageId)) return;
    const findAll = await this.findAllByFrameworkIdAndListCodeLanguageId(
      frameworkId,
      listDeletedCodeLanguageId,
    );
    for (const content of findAll) {
      await this.removeById(content.id);
    }
  }
}
