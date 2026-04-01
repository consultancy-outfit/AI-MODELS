import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from '../../common/auth/public.decorator';
import {
  AuthResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  LoginDto,
  LogoutResponseDto,
  SessionDto,
  SignupDto,
} from './auth.dto';
import { AuthService } from './auth.services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiOkResponse({ type: AuthResponseDto })
  signup(
    @Body() body: SignupDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.signup(body, req);
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax' });
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiOkResponse({ type: AuthResponseDto })
  login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.login(body, req);
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax' });
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh an access token using the refresh cookie' })
  @ApiOkResponse({ type: AuthResponseDto })
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = this.authService.refresh(readCookie(req, 'refreshToken'), req);
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax' });
    return { accessToken: result.accessToken, user: result.user };
  }

  @Get('me')
  @ApiOperation({ summary: 'Return the current authenticated user' })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Response shape includes user only at runtime.' })
  me(@Req() req: Request) {
    return this.authService.me(readBearerToken(req));
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Return active sessions for the current user' })
  @ApiOkResponse({ type: SessionDto, isArray: true })
  sessions(@Req() req: Request) {
    return this.authService.getSessions(readBearerToken(req));
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Trigger forgot password flow' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Clear the current refresh token session' })
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = this.authService.logout(readCookie(req, 'refreshToken'));
    res.cookie('refreshToken', '', { httpOnly: true, sameSite: 'lax', maxAge: 0 });
    return result;
  }
}

function readBearerToken(req: Request) {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
}

function readCookie(req: Request, key: string) {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) return undefined;
  const match = rawCookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));
  return match?.slice(key.length + 1);
}
