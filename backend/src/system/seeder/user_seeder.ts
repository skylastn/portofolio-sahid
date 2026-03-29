import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../feature/auth/domain/model/entities/user_entity';
import { UserRole } from '../../feature/auth/domain/model/enum/user_role';

export class UserSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(UserEntity);

    const email = 'admin@gmail.com';
    const exists = await repo.findOne({ where: { email } });

    if (exists) {
      console.log('ℹ️ Admin already exists');
      return;
    }

    await repo.save(
      repo.create({
        name: 'Admin',
        username: 'admin',
        email: email,
        password: await bcrypt.hash(
          process.env.ADMIN_PASSWORD ?? '@Coba123',
          10,
        ),
        role: UserRole.ADMIN,
        isActive: true,
      }),
    );

    console.log('✅ Admin created');
  }
}
