import { Inject, Injectable } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { BucketItemStat, Client } from 'minio';
import { MinioResponse } from '../domain/model/response/minio_response';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CONNECTION)
    private readonly minioClient: Client,
  ) {}

  async getPresignedUploadUrl(objectKey: string): Promise<MinioResponse> {
    const bucket = process.env.MINIO_BUCKET as string;
    // console.log({
    //   endpoint: process.env.MINIO_ENDPOINT,
    //   bucket: process.env.MINIO_BUCKET,
    //   accessKey: process.env.MINIO_ACCESS_KEY,
    //   secretKey: process.env.MINIO_SECRET_KEY,
    //   objectKey: objectKey,
    // });
    const result = await this.minioClient.presignedPutObject(
      bucket,
      objectKey,
      60 * 5,
    );
    return new MinioResponse(objectKey, result);
  }

  async getPresignedViewUrl(objectKey: string): Promise<MinioResponse> {
    const bucket = process.env.MINIO_BUCKET as string;
    const result = await this.minioClient.presignedGetObject(
      bucket,
      objectKey,
      60 * 5,
    );
    return new MinioResponse(objectKey, result);
  }

  async removeObject(objectKey: string) {
    const bucket = process.env.MINIO_BUCKET as string;
    await this.minioClient.removeObject(bucket, objectKey);
  }

  async statObject(objectKey: string): Promise<BucketItemStat> {
    const bucket = process.env.MINIO_BUCKET as string;
    return await this.minioClient.statObject(bucket, objectKey);
  }
}
