import { Inject, Injectable } from '@nestjs/common';
import type { UserEntity } from '../domain/model/entities/user_entity';
import { USER_REPOSITORY } from '../domain/repository/user_repository';
import type { UserRepository } from '../domain/repository/user_repository';
import { UserResponse } from '../domain/model/response/user_response';
import type { RegisterUserRequest } from '../domain/model/request/user/register_user_request';

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

  async createUser(data: RegisterUserRequest): Promise<UserEntity | null> {
    const result = await this.usersRepository.create(data);
    return result;
  }

  async updateUser(
    id: string,
    data: RegisterUserRequest,
  ): Promise<UserEntity | null> {
    const result = await this.usersRepository.update(data, id);
    return result;
  }

  async removeById(id: number): Promise<void> {
    return await this.usersRepository.removeById(id);
  }
}
