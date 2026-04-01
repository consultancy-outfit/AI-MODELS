import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ChatService } from './chat.services';
import type { ImportPayload, MessagePayload, SessionPayload } from './chat.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('session')
  createSession(@Body() body: SessionPayload, @Req() req: Request) {
    return this.chatService.createSession(body, req);
  }

  @Post('sessions')
  createSessionAlias(@Body() body: SessionPayload, @Req() req: Request) {
    return this.chatService.createSession(body, req);
  }

  @Post('session/import')
  importGuestSessions(@Body() body: ImportPayload, @Req() req: Request) {
    return this.chatService.importGuestSessions(body, req);
  }

  @Post('send')
  send(@Body() body: MessagePayload, @Req() req: Request) {
    return this.chatService.send(body, req);
  }

  @Post('message')
  sendAlias(@Body() body: MessagePayload, @Req() req: Request) {
    return this.chatService.send(body, req);
  }

  @Get('history')
  history(@Query('sessionId') sessionId?: string, @Query('guestSessionId') guestSessionId?: string, @Req() req?: Request) {
    return this.chatService.history(sessionId, guestSessionId, req);
  }

  @Get(':sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    return this.chatService.getSession(sessionId);
  }

  @Delete('session/:id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.chatService.delete(id, req);
  }
}
