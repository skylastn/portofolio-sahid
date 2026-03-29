import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { MinioService } from '../../application/minio_service';
import { AuthGuards } from '../../../auth/presentation/guard/auth_guards';

@Controller('api/minio')
export class MinioController {
  constructor(private readonly service: MinioService) {}

  @UseGuards(AuthGuards)
  @Get('presign-upload')
  async presignUpload(@Query('key') key: string) {
    return await this.service.getPresignedUploadUrl(key);
  }

  @Get('presign-view')
  async presignView(@Query('key') key: string) {
    return await this.service.getPresignedViewUrl(key);
  }

  @Delete()
  async remove(@Query('key') key: string) {
    await this.service.removeObject(key);
    return { success: true };
  }
}
