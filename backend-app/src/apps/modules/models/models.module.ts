import { Module } from '@nestjs/common';
import { ModelsController } from './models.controllers';
import { ModelsService } from './models.services';

@Module({
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
