import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { readCookie } from './auth.helpers';
import { JwtService } from './jwt.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    this.jwtService.verifyRefreshToken(readCookie(req, 'refreshToken'));
    return true;
  }
}
