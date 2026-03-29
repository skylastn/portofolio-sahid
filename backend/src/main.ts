import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './shared/core/module/app_module';
import { FailedResponseInterceptor } from './shared/core/interceptor/failed_response_interceptor';
import { SuccessResponseInterceptor } from './shared/core/interceptor/success_response_interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  // ✅ serve static folder ./public => URL jadi /uploads/...
  app.useStaticAssets(join(process.cwd(), 'public'));

  const allowedOrigins = [
    'https://sahid.skytech.my.id',
    'http://localhost:3005',
  ];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      // ❗ jangan throw error, cukup false
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
  });

  // ✅ handle all OPTIONS preflight (hindari '*' yang bikin path-to-regexp error)
  expressApp.options(/.*/, (_req: any, res: any) => res.sendStatus(204));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new FailedResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
