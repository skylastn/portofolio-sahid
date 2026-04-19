import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserEntity } from '../domain/model/entities/user_entity';
import { USER_REPOSITORY } from '../domain/repository/user_repository';
import type { UserRepository } from '../domain/repository/user_repository';
import { UserResponse } from '../domain/model/response/user_response';
import type { CreateUserRequest } from '../domain/model/request/user/create_user_request';
import { FormatHelper } from '../../../shared/utils/utility/format_helper';
import { UserRole } from '../domain/model/enum/user_role';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private usersRepository: UserRepository,
  ) {}

  findMe(): UserResponse | null {
    return this.usersRepository.findMe();
  }

  async findAll(): Promise<UserResponse[]> {
    const result = await this.usersRepository.findAll();
    return UserResponse.convertListFromEntities(result);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const result = await this.usersRepository.findById(id);
    return result;
  }

  async findByIdResponse(id: string): Promise<UserResponse | null> {
    const result = await this.usersRepository.findById(id);
    if (!FormatHelper.isPresent(result)) {
      return null;
    }
    return UserResponse.convertFromEntity(result);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const result = await this.usersRepository.findByUsername(username);
    return result;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await this.usersRepository.findByEmail(email);
    return result;
  }

  async createOrUpdate(data: UserEntity): Promise<UserEntity | null> {
    const result = await this.usersRepository.createOrUpdate(data);
    return result;
  }

  async removeById(id: number): Promise<void> {
    return await this.usersRepository.removeById(id);
  }

  async createUser(data: CreateUserRequest): Promise<UserEntity | null> {
    const result = await this.usersRepository.createOrUpdate(data.toEntity());
    return result;
  }

  async updateUser(
    id: string,
    data: CreateUserRequest,
  ): Promise<UserEntity | null> {
    const entity = await this.findById(id);
    if (!FormatHelper.isPresent(entity)) {
      throw new Error('User not found');
    }
    if (entity.role != UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    Object.assign(entity, data);
    const result = await this.createOrUpdate(entity);
    return result;
  }
}
