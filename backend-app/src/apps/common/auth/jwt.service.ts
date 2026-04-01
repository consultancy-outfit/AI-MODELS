import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import type { JwtPayload, JwtTokenType } from './auth.types';

type TokenOptions = {
  expiresInSeconds: number;
  sessionId?: string;
};

const base64Url = {
  encode(input: string | Buffer) {
    return Buffer.from(input).toString('base64url');
  },
  decode(input: string) {
    return Buffer.from(input, 'base64url').toString('utf8');
  },
};

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  issueAccessToken(userId: string, sessionId: string) {
    return this.signToken('access', userId, {
      sessionId,
      expiresInSeconds: 60 * 15,
    });
  }

  issueRefreshToken(userId: string, sessionId: string) {
    return this.signToken('refresh', userId, {
      sessionId,
      expiresInSeconds: 60 * 60 * 24 * 30,
    });
  }

  issueVerificationToken(userId: string) {
    return this.signToken('verification', userId, {
      expiresInSeconds: 60 * 60 * 24,
    });
  }

  verifyAccessToken(token?: string | null) {
    return this.verifyToken(token, 'access');
  }

  verifyRefreshToken(token?: string | null) {
    return this.verifyToken(token, 'refresh');
  }

  verifyVerificationToken(token?: string | null) {
    return this.verifyToken(token, 'verification');
  }

  private signToken(type: JwtTokenType, userId: string, options: TokenOptions) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      sub: userId,
      type,
      sessionId: options.sessionId,
      iat: issuedAt,
      exp: issuedAt + options.expiresInSeconds,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64Url.encode(JSON.stringify(header));
    const encodedPayload = base64Url.encode(JSON.stringify(payload));
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`, this.getSecret(type));

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private verifyToken(token: string | null | undefined, expectedType: JwtTokenType) {
    if (!token) {
      throw new UnauthorizedException('Token is required.');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token.');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`, this.getSecret(expectedType));

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid token signature.');
    }

    let payload: JwtPayload;

    try {
      payload = JSON.parse(base64Url.decode(encodedPayload)) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid token payload.');
    }

    if (payload.type !== expectedType) {
      throw new UnauthorizedException('Invalid token type.');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token subject.');
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token has expired.');
    }

    return payload;
  }

  private sign(value: string, secret: string) {
    return createHmac('sha256', secret).update(value).digest('base64url');
  }

  private getSecret(type: JwtTokenType) {
    switch (type) {
      case 'access':
        return this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET', 'change-me-access-token-secret');
      case 'refresh':
        return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET', 'change-me-refresh-token-secret');
      case 'verification':
        return this.configService.get<string>('JWT_VERIFICATION_TOKEN_SECRET', 'change-me-verification-token-secret');
    }
  }
}
