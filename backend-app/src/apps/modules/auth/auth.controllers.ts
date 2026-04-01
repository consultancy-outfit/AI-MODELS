import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { RefreshTokenGuard } from '../../common/auth/refresh-token.guard';
import {
  readCookie,
  requireAuthenticatedUser,
} from '../../common/auth/auth.helpers';
import {
  AuthResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  LoginDto,
  LogoutResponseDto,
  SessionDto,
  SignupDto,
  VerificationTokenResponseDto,
  VerificationResponseDto,
  VerifyTokenDto,
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
    return this.authService.signup(body, req).then((result) => {
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax' });
      return { accessToken: result.accessToken, user: result.user };
    });
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
    return this.authService.login(body, req).then((result) => {
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax' });
      return { accessToken: result.accessToken, user: result.user };
    });
  }

  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh an access token using the refresh cookie' })
  @ApiOkResponse({ type: AuthResponseDto })
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(readCookie(req, 'refreshToken'), req).then((result) => {
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax' });
      return { accessToken: result.accessToken, user: result.user };
    });
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the current authenticated user' })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Response shape includes user only at runtime.' })
  me(@Req() req: Request) {
    return this.authService.me(requireAuthenticatedUser(req));
  }

  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return active sessions for the current user' })
  @ApiOkResponse({ type: SessionDto, isArray: true })
  sessions(@Req() req: Request) {
    return this.authService.getSessions(requireAuthenticatedUser(req));
  }

  @Post('verification-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue a verification JWT for the current user' })
  @ApiOkResponse({ type: VerificationTokenResponseDto })
  verificationToken(@Req() req: Request) {
    return this.authService.issueVerificationToken(requireAuthenticatedUser(req));
  }

  @Public()
  @Post('verify')
  @ApiOperation({ summary: 'Verify a JWT verification token' })
  @ApiOkResponse({ type: VerificationResponseDto })
  verify(@Body() body: VerifyTokenDto) {
    return this.authService.verify(body.token);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Trigger forgot password flow' })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear the current refresh token session' })
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(readCookie(req, 'refreshToken')).then((result) => {
      res.cookie('refreshToken', '', { httpOnly: true, sameSite: 'lax', maxAge: 0 });
      return result;
    });
  }
}
