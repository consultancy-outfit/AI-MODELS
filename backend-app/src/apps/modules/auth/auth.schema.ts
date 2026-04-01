import { randomUUID } from 'node:crypto';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent?: string;
};

type AuthStore = {
  users: AuthUser[];
  sessions: AuthSession[];
  accessTokens: Map<string, string>;
  refreshTokens: Map<string, string>;
};

const globalStore = globalThis as typeof globalThis & {
  __nexusAuthStore__?: AuthStore;
};

function createStore(): AuthStore {
  return {
    users: [],
    sessions: [],
    accessTokens: new Map<string, string>(),
    refreshTokens: new Map<string, string>(),
  };
}

export const authStore = globalStore.__nexusAuthStore__ ?? createStore();
globalStore.__nexusAuthStore__ = authStore;

export function issueAccessToken(userId: string) {
  const token = `access_${randomUUID()}`;
  authStore.accessTokens.set(token, userId);
  return token;
}

export function issueRefreshToken(userId: string) {
  const token = `refresh_${randomUUID()}`;
  authStore.refreshTokens.set(token, userId);
  return token;
}

export function getUserByAccessToken(token?: string | null) {
  if (!token) return null;
  const userId = authStore.accessTokens.get(token);
  if (!userId) return null;
  return authStore.users.find((user) => user.id === userId) ?? null;
}

export function getUserByRefreshToken(token?: string | null) {
  if (!token) return null;
  const userId = authStore.refreshTokens.get(token);
  if (!userId) return null;
  return authStore.users.find((user) => user.id === userId) ?? null;
}

export function touchSessionByRefreshToken(refreshToken?: string | null) {
  if (!refreshToken) return null;
  const session = authStore.sessions.find((item) => item.refreshToken === refreshToken) ?? null;
  if (session) {
    session.lastActiveAt = new Date().toISOString();
  }
  return session;
}
