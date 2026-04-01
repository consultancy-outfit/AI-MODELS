import { Module } from '@nestjs/common';
import { UploadController } from './upload.controllers';
import { UploadService } from './upload.services';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
