import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../domain/model/entities/user_entity';
import type { UserRepository } from '../../domain/repository/user_repository';

import { UserRole } from '../../domain/model/enum/user_role';
import { getEntityManager } from '../../../../shared/core/provider/transaction_provider';
import { CurrentUserProvider } from '../../../../shared/core/provider/current_user_provider';
import type { UserResponse } from '../../domain/model/response/user_response';
import type { CreateUserRequest } from '../../domain/model/request/user/create_user_request';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly baseRepo: Repository<UserEntity>,
    private readonly currentUser: CurrentUserProvider,
  ) {}

  // Running Transaction Interceptor
  private get repo(): Repository<UserEntity> {
    const manager = getEntityManager(this.baseRepo.manager);
    return manager.getRepository(UserEntity);
  }

  findMe(): UserResponse | null {
    return this.currentUser.user;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { email: email } });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  async createOrUpdate(data: UserEntity): Promise<UserEntity | null> {
    return this.repo.save(data);
  }

  async removeById(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}
