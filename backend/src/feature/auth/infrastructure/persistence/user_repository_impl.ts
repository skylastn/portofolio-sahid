import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../domain/model/entities/user_entity';
import { UserRepository } from '../../domain/repository/user_repository';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../domain/model/enum/user_role';
import { getEntityManager } from '../../../../shared/core/provider/transaction_provider';
import { CurrentUserProvider } from '../../../../shared/core/provider/current_user_provider';
import { UserResponse } from '../../domain/model/response/user_response';
import { RegisterUserRequest } from '../../domain/model/request/user/register_user_request';

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

  async create(data: RegisterUserRequest): Promise<UserEntity> {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.repo.save({
      ...data,
      password: hashed,
      role: data.role ?? UserRole.USER,
    });
  }

  async update(data: RegisterUserRequest, id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.username && data.username !== user.username) {
      const exist = await this.repo.findOne({
        where: { username: data.username },
      });
      if (exist) throw new BadRequestException('Username already exists');
    }

    Object.assign(user, data);
    return this.repo.save(user);
  }

  async removeById(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}
