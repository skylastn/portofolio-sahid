import { Inject, Injectable } from '@nestjs/common';
import { PaginationResponse } from '../../../shared/core/model/response/pagination_response';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { ToolEntity } from '../domain/model/entities/tool_entity';
import { CreateToolRequest } from '../domain/model/request/tool/create_tool_request';
import { ToolRequest } from '../domain/model/request/tool/tool_request';
import { ToolResponse } from '../domain/model/response/tool_response';
import {
  TOOL_DATABASE_REPOSITORY,
} from '../domain/repository/database/tool_database_repository';
import type { ToolDatabaseRepository } from '../domain/repository/database/tool_database_repository';
import { syncEntityPosition } from './sortable_position_service';

@Injectable()
export class ToolService {
  constructor(
    @Inject(TOOL_DATABASE_REPOSITORY)
    private repo: ToolDatabaseRepository,
  ) {}

  async findAllPagination(
    request: ToolRequest,
  ): Promise<PaginationResponse<ToolResponse>> {
    const paginationEntity = await this.repo.findAllPagination(request);
    return PaginationResponse.map(paginationEntity, async (u) =>
      ToolResponse.convertFromEntity(u),
    );
  }

  async findAllByListIds(ids: string[]): Promise<ToolEntity[]> {
    return await this.repo.findAllByListIds(ids);
  }

  async findOneById(id: string): Promise<ToolEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<ToolResponse | null> {
    const content = await this.findOneById(id);
    if (!FormatHelper.isPresent(content)) {
      throw new Error('Tool not found');
    }
    return ToolResponse.convertFromEntity(content);
  }

  async createOrUpdate(data: ToolEntity): Promise<ToolEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Tool not found');
    }
    await this.repo.removeById(id);
  }

  async createTool(data: CreateToolRequest): Promise<ToolEntity | null> {
    return await syncEntityPosition(
      this.repo,
      data.convertToEntity(),
      data.position,
    );
  }

  async updateTool(
    id: string,
    data: CreateToolRequest,
  ): Promise<ToolEntity | null> {
    const find = await this.findOneById(id);
    if (!FormatHelper.isPresent(find)) {
      throw new Error('Tool not found');
    }
    const entity = data.convertToEntity();
    if (data.position == null) {
      entity.position = find.position;
    }
    Object.assign(find, entity);
    return data.position == null
      ? await this.createOrUpdate(find)
      : await syncEntityPosition(this.repo, find, data.position);
  }
}
