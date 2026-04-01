import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import type { ForgotPasswordDto, LoginDto, SignupDto } from './auth.dto';
import {
  authStore,
  getUserByAccessToken,
  getUserByRefreshToken,
  issueAccessToken,
  issueRefreshToken,
  touchSessionByRefreshToken,
} from './auth.schema';

@Injectable()
export class AuthService {
  signup(body: SignupDto, req?: Request) {
    const existing = authStore.users.find((user) => user.email.toLowerCase() === body.email.toLowerCase());
    if (existing) {
      throw new UnauthorizedException('Email already registered.');
    }

    const user = {
      id: randomUUID(),
      name: body.name?.trim() || 'New User',
      email: body.email.toLowerCase(),
      password: body.password,
      plan: 'free' as const,
      createdAt: new Date().toISOString(),
    };

    authStore.users.push(user);
    return this.issue(user.id, req);
  }

  login(body: LoginDto, req?: Request) {
    const user = authStore.users.find(
      (entry) => entry.email.toLowerCase() === body.email.toLowerCase() && entry.password === body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.issue(user.id, req);
  }

  refresh(refreshToken?: string, req?: Request) {
    const user = getUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const session = touchSessionByRefreshToken(refreshToken);
    return this.issue(user.id, req, session?.id);
  }

  me(accessToken?: string) {
    const user = getUserByAccessToken(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized.');
    }

    return this.toSafeUser(user);
  }

  getSessions(accessToken?: string) {
    const user = getUserByAccessToken(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized.');
    }

    return authStore.sessions
      .filter((session) => session.userId === user.id)
      .map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
        userAgent: session.userAgent ?? 'Unknown device',
      }));
  }

  forgotPassword(body: ForgotPasswordDto) {
    const user = authStore.users.find((entry) => entry.email === body.email.toLowerCase());
    return {
      message: user
        ? 'Reset link generated in mock mode.'
        : 'If the email exists, a reset link has been generated.',
    };
  }

  logout(refreshToken?: string) {
    if (!refreshToken) {
      return { success: true };
    }

    const sessionIndex = authStore.sessions.findIndex((session) => session.refreshToken === refreshToken);
    if (sessionIndex >= 0) {
      const session = authStore.sessions[sessionIndex];
      authStore.accessTokens.delete(session.accessToken);
      authStore.refreshTokens.delete(session.refreshToken);
      authStore.sessions.splice(sessionIndex, 1);
    }

    return { success: true };
  }

  private issue(userId: string, req?: Request, existingSessionId?: string) {
    const accessToken = issueAccessToken(userId);
    const refreshToken = issueRefreshToken(userId);
    const user = authStore.users.find((entry) => entry.id === userId)!;
    const now = new Date().toISOString();

    if (existingSessionId) {
      const existingSession = authStore.sessions.find((session) => session.id === existingSessionId);
      if (existingSession) {
        authStore.accessTokens.delete(existingSession.accessToken);
        authStore.refreshTokens.delete(existingSession.refreshToken);
        existingSession.accessToken = accessToken;
        existingSession.refreshToken = refreshToken;
        existingSession.lastActiveAt = now;
        existingSession.userAgent = req?.headers['user-agent'];
      }
    } else {
      authStore.sessions.unshift({
        id: randomUUID(),
        userId,
        accessToken,
        refreshToken,
        createdAt: now,
        lastActiveAt: now,
        userAgent: req?.headers['user-agent'],
      });
    }

    return {
      accessToken,
      refreshToken,
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: (typeof authStore.users)[number]) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      createdAt: user.createdAt,
    };
  }
}
