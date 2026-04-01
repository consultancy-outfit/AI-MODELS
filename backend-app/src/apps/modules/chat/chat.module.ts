import { Module } from '@nestjs/common';
import { ChatController } from './chat.controllers';
import { ChatService } from './chat.services';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
