import { Module } from '@nestjs/common';
import { FormsController } from './forms.controllers';
import { FormsService } from './forms.services';

@Module({
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
