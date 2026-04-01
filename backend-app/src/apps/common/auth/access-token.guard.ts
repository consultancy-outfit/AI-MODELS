import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { mockDb } from '../../store/mock-db';
import { readBearerToken } from './auth.helpers';
import { JwtService } from './jwt.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = readBearerToken(req);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.attachUserIfPresent(req, token);
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Unauthorized.');
    }

    req.user = this.resolveUserFromToken(token);
    return true;
  }

  private attachUserIfPresent(req: Request, token?: string) {
    if (!token) {
      return;
    }

    try {
      req.user = this.resolveUserFromToken(token);
    } catch {
      req.user = undefined;
    }
  }

  private resolveUserFromToken(token: string) {
    const payload = this.jwtService.verifyAccessToken(token);
    const user = mockDb.users.find((entry) => entry.id === payload.sub);

    if (!user) {
      throw new UnauthorizedException('Unauthorized.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      createdAt: user.createdAt,
    };
  }
}
