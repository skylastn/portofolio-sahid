import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../../feature/auth/domain/model/entities/user_entity';
import path from 'path';
import { AchievementEntity } from '../../feature/portofolio/domain/model/entities/achievement_entity';
import { AppsSourceEntity } from '../../feature/portofolio/domain/model/entities/apps/apps_source_entity';
import { CategoryEntity } from '../../feature/portofolio/domain/model/entities/category_entity';
import { CodeLanguageEntity } from '../../feature/portofolio/domain/model/entities/code_language_entity';
import { FrameworkEntity } from '../../feature/portofolio/domain/model/entities/framework_entity';
import { GeneralEntity } from '../../feature/portofolio/domain/model/entities/general_entity';
import { PortofolioCategoryMappingEntity } from '../../feature/portofolio/domain/model/entities/portofolio/portofolio_category_mapping_entity';
import { PortofolioEntity } from '../../feature/portofolio/domain/model/entities/portofolio/portofolio_entity';
import { PortofolioFrameworkMappingEntity } from '../../feature/portofolio/domain/model/entities/portofolio/portofolio_framework_mapping_entity';
import { WorkEntity } from '../../feature/portofolio/domain/model/entities/work/work_entity';
import { WorkPortofolioMappingEntity } from '../../feature/portofolio/domain/model/entities/work/work_portofolio_mapping_entity';

export function dbConfiguration(): DataSourceOptions {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'test',
    entities: [
      UserEntity,
      GeneralEntity,
      AppsSourceEntity,
      PortofolioEntity,
      WorkEntity,
      AchievementEntity,
      CategoryEntity,
      CodeLanguageEntity,
      FrameworkEntity,
      PortofolioCategoryMappingEntity,
      PortofolioFrameworkMappingEntity,
      WorkPortofolioMappingEntity,
    ],
    migrations: [
      isProd
        ? path.join(__dirname, '../dist/migrations/*.{js}') // production: .js di dist
        : path.join(__dirname, '../../system/migrations/*.{ts,js}'), // development: .ts + .js
    ],
    synchronize: false,
  };
}
