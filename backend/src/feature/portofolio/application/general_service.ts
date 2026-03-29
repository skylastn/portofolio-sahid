import { Injectable, Inject } from '@nestjs/common';
import {
  GENERAL_DATABASE_REPOSITORY,
  GeneralDatabaseRepository,
} from '../domain/repository/database/general_database_repository';
import { GeneralEntity } from '../domain/model/entities/general_entity';
import { CreateGeneralRequest } from '../domain/model/request/general/create_general_request';
import { GeneralResponse } from '../domain/model/response/general_response';

@Injectable()
export class GeneralService {
  constructor(
    @Inject(GENERAL_DATABASE_REPOSITORY)
    private repo: GeneralDatabaseRepository,
  ) {}

  async findAll(): Promise<GeneralEntity[]> {
    return await this.repo.findAll();
  }

  async findOneById(id: string): Promise<GeneralEntity | null> {
    return await this.repo.findOneById(id);
  }

  async findOneByIdResponse(id: string): Promise<GeneralResponse | null> {
    const general = await this.repo.findOneById(id);
    return GeneralResponse.convertFromEntity(general);
  }

  async createOrUpdate(data: GeneralEntity): Promise<GeneralEntity | null> {
    return await this.repo.createOrUpdate(data);
  }

  async removeById(id: string): Promise<void> {
    return await this.repo.removeById(id);
  }

  async createGeneral(
    data: CreateGeneralRequest,
  ): Promise<GeneralEntity | null> {
    return await this.repo.createOrUpdate(data.convertToEntity());
  }

  async updateGeneral(
    id: string,
    data: CreateGeneralRequest,
  ): Promise<GeneralEntity | null> {
    const find = await this.repo.findOneById(id);
    if (!find) {
      throw new Error('General not found');
    }
    Object.assign(find, data);
    return await this.repo.createOrUpdate(find);
  }
}
