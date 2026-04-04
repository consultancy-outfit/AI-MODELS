import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../common/auth/auth.types';
import { JwtService } from '../../common/auth/jwt.service';
import type { ForgotPasswordDto, LoginDto, SignupDto } from './auth.dto';
import { AuthPersistenceService } from './auth.persistence';
import { mockDb } from '../../store/mock-db';

@Injectable()
export class AuthService {
  constructor(
    private readonly authPersistenceService: AuthPersistenceService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: SignupDto, req?: Request) {
    const existing = mockDb.users.find((user) => user.email.toLowerCase() === body.email.toLowerCase());
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

    mockDb.users.push(user);
    await this.authPersistenceService.syncUser(user);
    return this.issue(user.id, req);
  }

  async login(body: LoginDto, req?: Request) {
    const user = mockDb.users.find(
      (entry) => entry.email.toLowerCase() === body.email.toLowerCase() && entry.password === body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.issue(user.id, req);
  }

  async refresh(refreshToken?: string, req?: Request) {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const session = mockDb.authSessions.find((entry) => entry.id === payload.sessionId);
    if (!session || session.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    return this.issue(payload.sub, req, session.id);
  }

  me(user: AuthenticatedUser) {
    return user;
  }

  getSessions(user: AuthenticatedUser) {
    return mockDb.authSessions
      .filter((session) => session.userId === user.id)
      .map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
        userAgent: session.userAgent ?? 'Unknown device',
      }));
  }

  issueVerificationToken(user: AuthenticatedUser) {
    return {
      verificationToken: this.jwtService.issueVerificationToken(user.id),
    };
  }

  forgotPassword(body: ForgotPasswordDto) {
    const user = mockDb.users.find((entry) => entry.email === body.email.toLowerCase());
    return {
      message: user
        ? 'Reset link generated in mock mode.'
        : 'If the email exists, a reset link has been generated.',
    };
  }

  verify(token: string) {
    const payload = this.jwtService.verifyVerificationToken(token);
    const user = mockDb.users.find((entry) => entry.id === payload.sub);

    if (!user) {
      throw new UnauthorizedException('Unauthorized.');
    }

    return {
      verified: true,
      user: this.toSafeUser(user),
    };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return { success: true };
    }

    const sessionIndex = mockDb.authSessions.findIndex((session) => session.refreshToken === refreshToken);
    if (sessionIndex >= 0) {
      mockDb.authSessions.splice(sessionIndex, 1);
    }
    await this.authPersistenceService.deleteSessionByRefreshToken(refreshToken);

    return { success: true };
  }

  private async issue(userId: string, req?: Request, existingSessionId?: string) {
    const user = mockDb.users.find((entry) => entry.id === userId)!;
    const now = new Date().toISOString();
    const sessionId = existingSessionId ?? randomUUID();
    const accessToken = this.jwtService.issueAccessToken(userId, sessionId);
    const refreshToken = this.jwtService.issueRefreshToken(userId, sessionId);

    if (existingSessionId) {
      const existingSession = mockDb.authSessions.find((session) => session.id === existingSessionId);
      if (existingSession) {
        existingSession.accessToken = accessToken;
        existingSession.refreshToken = refreshToken;
        existingSession.lastActiveAt = now;
        existingSession.userAgent = req?.headers['user-agent'];
        await this.authPersistenceService.syncSession(existingSession);
      }
    } else {
      const session = {
        id: sessionId,
        userId,
        accessToken,
        refreshToken,
        createdAt: now,
        lastActiveAt: now,
        userAgent: req?.headers['user-agent'],
      };
      mockDb.authSessions.unshift(session);
      await this.authPersistenceService.syncSession(session);
    }

    return {
      accessToken,
      refreshToken,
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: (typeof mockDb.users)[number]) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      createdAt: user.createdAt,
    };
  }
}
