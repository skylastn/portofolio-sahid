import type { UserEntity } from '../model/entities/user_entity';
import type { CreateUserRequest } from '../model/request/user/create_user_request';
import type { UserResponse } from '../model/response/user_response';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface UserRepository {
  findMe(): UserResponse | null;
  findAll(): Promise<UserEntity[]>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  createOrUpdate(data: UserEntity): Promise<UserEntity | null>;
  // create(data: CreateUserRequest): Promise<UserEntity | null>;
  // update(data: CreateUserRequest, id: string): Promise<UserEntity>;
  removeById(id: number): Promise<void>;
}
