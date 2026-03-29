import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../domain/model/entities/category_entity';
import { CategoryService } from '../../application/category_service';
import { CategoryController } from '../controller/category_controller';
import { Module } from '@nestjs/common';
import { CategoryDatabaseRepositoryImpl } from '../../infrastructure/persistence/database/category_database_repository_impl';
import { CATEGORY_DATABASE_REPOSITORY } from '../../domain/repository/database/category_database_repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    CategoryService,
    {
      provide: CATEGORY_DATABASE_REPOSITORY,
      useClass: CategoryDatabaseRepositoryImpl,
    },
  ],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
