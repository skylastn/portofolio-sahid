import { Module } from '@nestjs/common';
import { MinioService } from '../../application/minio_service';
import { NestMinioModule } from 'nestjs-minio';
import { MinioController } from '../controller/minio_controller';
import { ENV } from '../../../../shared/constant/variable';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // console.log({
        //   endpoint: config.get<string>('MINIO_ENDPOINT')!,
        //   bucket: config.get<string>('MINIO_BUCKET')!,
        //   accessKey: config.get<string>('MINIO_ACCESS_KEY')!,
        //   secretKey: config.get<string>('MINIO_SECRET_KEY')!,
        // });
        return {
          isGlobal: true,
          endPoint: config.get<string>('MINIO_ENDPOINT')!,
          port: Number(config.get<string>('MINIO_PORT') ?? 9000),
          useSSL: false,
          accessKey: config.get<string>('MINIO_ACCESS_KEY')!,
          secretKey: config.get<string>('MINIO_SECRET_KEY')!,
        };
      },
    }),
  ],
  providers: [MinioService],
  exports: [MinioService],
  controllers: [MinioController],
})
export class MinioModule {}
