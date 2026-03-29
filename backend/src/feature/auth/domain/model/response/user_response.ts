import { UserEntity } from '../entities/user_entity';
import { UserRole } from '../enum/user_role';

type UserResponseProps = {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export class UserResponse {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(content: UserResponseProps) {
    this.id = content.id;
    this.name = content.name;
    this.username = content.username;
    this.password = content.password;
    this.role = content.role;
    this.isActive = content.isActive;
    this.createdAt = content.createdAt;
    this.updatedAt = content.updatedAt;
    this.deletedAt = content.deletedAt;
  }

  static convertFromEntity(user: UserEntity | null): UserResponse | null {
    if (!user) return null;
    return new UserResponse({
      id: user.id,
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }

  static convertListFromEntities(users: UserEntity[]): UserResponse[] {
    return users.map((user) => this.convertFromEntity(user)!);
  }

  get toMap(): UserResponseProps {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  static fromMap(user: UserResponseProps): UserResponse {
    return new UserResponse(user);
  }
}
