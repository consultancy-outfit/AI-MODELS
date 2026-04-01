import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from './auth.types';

export function readBearerToken(req: Request) {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
}

export function readCookie(req: Request, key: string) {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) return undefined;

  const match = rawCookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));

  return match?.slice(key.length + 1);
}

export function requireAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedException('Unauthorized.');
  }

  return req.user as AuthenticatedUser;
}
