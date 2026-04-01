import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth/public.decorator';
import { ChatService } from './chat.services';
import type { ImportPayload, MessagePayload, SessionPayload } from './chat.schema';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Public()
  @Post('session')
  createSession(@Body() body: SessionPayload, @Req() req: Request) {
    return this.chatService.createSession(body, req);
  }

  @Public()
  @Post('sessions')
  createSessionAlias(@Body() body: SessionPayload, @Req() req: Request) {
    return this.chatService.createSession(body, req);
  }

  @Post('session/import')
  @ApiBearerAuth('jwt')
  importGuestSessions(@Body() body: ImportPayload, @Req() req: Request) {
    return this.chatService.importGuestSessions(body, req);
  }

  @Public()
  @Post('send')
  send(@Body() body: MessagePayload, @Req() req: Request) {
    return this.chatService.send(body, req);
  }

  @Public()
  @Post('message')
  sendAlias(@Body() body: MessagePayload, @Req() req: Request) {
    return this.chatService.send(body, req);
  }

  @Public()
  @Get('history')
  history(@Query('sessionId') sessionId?: string, @Query('guestSessionId') guestSessionId?: string, @Req() req?: Request) {
    return this.chatService.history(sessionId, guestSessionId, req);
  }

  @Public()
  @Get(':sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    return this.chatService.getSession(sessionId);
  }

  @Delete('session/:id')
  @ApiBearerAuth('jwt')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.chatService.delete(id, req);
  }
}
