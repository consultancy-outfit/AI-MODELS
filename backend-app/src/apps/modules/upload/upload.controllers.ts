import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../../common/auth/public.decorator';
import { UploadService } from './upload.services';
import type { UploadBody } from './upload.schema';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post()
  upload(@Body() body: UploadBody, @Req() req: Request) {
    return this.uploadService.upload(body, req);
  }
}
