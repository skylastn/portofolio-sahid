import { UserEntity } from '../model/entities/user_entity';
import { RegisterUserRequest } from '../model/request/user/register_user_request';
import { UserResponse } from '../model/response/user_response';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface UserRepository {
  findMe(): UserResponse | null;
  findAll(): Promise<UserEntity[]>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(data: RegisterUserRequest): Promise<UserEntity | null>;
  update(data: RegisterUserRequest, id: string): Promise<UserEntity> ;
  removeById(id: number): Promise<void>;
}
