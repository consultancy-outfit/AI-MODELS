import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import type { Request } from 'express';
import { Public } from '../../common/auth/public.decorator';
import { UploadService } from './upload.services';
import { UploadBody } from './upload.schema';

const uploadsDir = join(process.cwd(), 'uploads');
mkdirSync(uploadsDir, { recursive: true });

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadsDir,
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  upload(
    @Body() body: UploadBody,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.uploadService.upload(body, req, file);
  }
}
