export type JwtTokenType = 'access' | 'refresh' | 'verification';

export type JwtPayload = {
  sub: string;
  type: JwtTokenType;
  sessionId?: string;
  iat: number;
  exp: number;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'team';
  createdAt: string;
};
