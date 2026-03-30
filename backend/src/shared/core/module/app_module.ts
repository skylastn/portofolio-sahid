import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from '../../../feature/auth/presentation/module/user_module';
import { DatabaseModule } from './database_module';
import { AuthModule } from '../../../feature/auth/presentation/module/auth_module';
import { AuthMiddleware } from '../../../feature/auth/presentation/middleware/auth_middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from '../interceptor/transaction_interceptor';
import { CategoryModule } from '../../../feature/portofolio/presentation/module/category_module';
import { LoggerMiddleware } from '../middleware/logger_middleware';
import { GeneralModule } from '../../../feature/portofolio/presentation/module/general_module';
import { CodeLanguageModule } from '../../../feature/portofolio/presentation/module/code_language_module';
import { MinioModule } from '../../../feature/support/presentation/module/minio_module';
import { FrameworkModule } from '../../../feature/portofolio/presentation/module/framework_module';
import { AchievementModule } from '../../../feature/portofolio/presentation/module/achievement_module';
import { PortofolioModule } from '../../../feature/portofolio/presentation/module/portofolio/portofolio_module';
@Module({
  imports: [
    DatabaseModule,
    MinioModule,
    UserModule,
    AuthModule,
    CategoryModule,
    GeneralModule,
    CodeLanguageModule,
    FrameworkModule,
    AchievementModule,
    PortofolioModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
