import { FormatHelper } from '../../../../../../shared/utils/utility/format_helper';
import { UserEntity } from '../../entities/user_entity';
import { UserRole } from '../../enum/user_role';
import * as bcrypt from 'bcrypt';

export class CreateUserRequest {
  name!: string;
  username!: string;
  password!: string;
  role?: UserRole;

  toEntity(): UserEntity {
    const user = new UserEntity();
    user.name = this.name;
    user.username = this.username;
    if (FormatHelper.isPresent(this.password)) {
      user.password = bcrypt.hashSync(this.password, 10);
    }
    user.role = this.role ?? UserRole.USER;
    return user;
  }
}
