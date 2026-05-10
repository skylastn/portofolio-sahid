import { Inject, Injectable } from '@nestjs/common';
import { FormatHelper } from '../../../../shared/utils/utility/format_helper';
import { PortofolioToolMappingEntity } from '../../domain/model/entities/portofolio/portofolio_tool_mapping_entity';
import { PortofolioToolMappingResponse } from '../../domain/model/response/portofolio/portofolio_tool_mapping_response';
import {
  PORTOFOLIO_TOOL_MAPPING_DATABASE_REPOSITORY,
} from '../../domain/repository/database/portofolio/portofolio_tool_mapping_database_repository';
import type { PortofolioToolMappingDatabaseRepository } from '../../domain/repository/database/portofolio/portofolio_tool_mapping_database_repository';
import { ToolService } from '../tool_service';

@Injectable()
export class PortofolioToolMappingService {
  constructor(
    @Inject(PORTOFOLIO_TOOL_MAPPING_DATABASE_REPOSITORY)
    private repo: PortofolioToolMappingDatabaseRepository,
    private toolService: ToolService,
  ) {}

  async findAllByPortofolioId(
    portofolioId: string,
  ): Promise<PortofolioToolMappingEntity[]> {
    return await this.repo.findAllByPortofolioId(portofolioId);
  }

  async findAllByListIds(
    ids: string[],
  ): Promise<PortofolioToolMappingEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }

  async findAllByPortofolioIdAndListToolId(
    portofolioId: string,
    listToolId: string[],
  ): Promise<PortofolioToolMappingEntity[]> {
    return await this.repo.findAllByPortofolioIdAndListToolId(
      portofolioId,
      listToolId,
    );
  }

  async findOneById(id: string): Promise<PortofolioToolMappingEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(
    id: string,
  ): Promise<PortofolioToolMappingResponse | null> {
    const content = await this.findOneById(id);
    if (!FormatHelper.isPresent(content)) {
      throw new Error('PortofolioToolMapping not found');
    }
    return PortofolioToolMappingResponse.convertFromEntity(content);
  }

  async createOrUpdate(
    data: PortofolioToolMappingEntity,
  ): Promise<PortofolioToolMappingEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async syncWithPortofolioIdAndListToolId(
    portofolioId: string,
    listToolId: string[],
    listDeletedToolId: string[],
  ): Promise<void> {
    if (FormatHelper.isNotEmpty(listDeletedToolId)) {
      await this.deleteAllByPortofolioIdAndListToolId(
        portofolioId,
        listDeletedToolId,
      );
    }
    if (!FormatHelper.isNotEmpty(listToolId)) return;
    const existing = await this.findAllByPortofolioIdAndListToolId(
      portofolioId,
      listToolId,
    );
    const existingSet = new Set(existing.map((x) => x.toolId));
    for (const toolId of listToolId) {
      if (existingSet.has(toolId)) continue;
      const find = await this.toolService.findOneById(toolId);
      if (!FormatHelper.isPresent(find)) {
        throw new Error('Tool not found');
      }
      const entity = new PortofolioToolMappingEntity();
      entity.portofolioId = portofolioId;
      entity.toolId = toolId;
      await this.createOrUpdate(entity);
    }
  }

  async deleteAllByPortofolioIdAndListToolId(
    portofolioId: string,
    listDeletedToolId: string[],
  ): Promise<void> {
    if (!FormatHelper.isNotEmpty(listDeletedToolId)) return;
    const findAll = await this.findAllByPortofolioIdAndListToolId(
      portofolioId,
      listDeletedToolId,
    );
    for (const content of findAll) {
      await this.removeById(content.id);
    }
  }
}
