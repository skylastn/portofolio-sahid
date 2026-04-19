import type { UserEntity } from '../entities/user_entity';
import { UserRole } from '../enum/user_role';

export interface UserResponseMap {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly username: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static convertFromEntity(user: UserEntity): UserResponse {
    return new UserResponse(
      user.id,
      user.name,
      user.username,
      user.password,
      user.role,
      user.isActive,
      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? null,
    );
  }

  static convertListFromEntities(users: readonly UserEntity[]): UserResponse[] {
    return users.map((user) => this.convertFromEntity(user)!);
  }

  get toMap(): UserResponseMap {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      password: this.password,
      role: this.role,
      is_active: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt ?? null,
    };
  }

  static fromMap(user: UserResponseMap): UserResponse {
    return new UserResponse(
      user.id,
      user.name,
      user.username,
      user.password,
      user.role,
      user.is_active,
      user.created_at,
      user.updated_at,
      user.deleted_at,
    );
  }
}
