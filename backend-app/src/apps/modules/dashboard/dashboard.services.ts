import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { requireAuthenticatedUser } from '../../common/auth/auth.helpers';
import { mockDb } from '../../store/mock-db';

@Injectable()
export class DashboardService {
  overview(req: Request) {
    const user = this.requireUser(req);
    const sessions = this.getUserSessions(user.id);
    return this.buildDashboardOverview(user, sessions);
  }

  history(req: Request) {
    const user = this.requireUser(req);
    const sessions = this.getUserSessions(user.id);
    return {
      items: sessions.map((session) => ({
        id: session.id,
        title: session.title,
        modelId: session.modelId,
        modelName: session.modelName,
        provider: session.provider,
        updatedAt: session.updatedAt,
        messageCount: session.messages.length,
        usage: session.usage,
      })),
      total: sessions.length,
    };
  }

  settings(req: Request) {
    const user = this.requireUser(req);
    return {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      preferences: {
        theme: 'light',
        language: 'English',
        guestMode: true,
        notifications: true,
      },
    };
  }

  billing(req: Request) {
    const user = this.requireUser(req);
    const sessions = this.getUserSessions(user.id);
    const usage = sessions.reduce(
      (acc, session) => {
        acc.requests += session.usage.requests;
        acc.totalTokens += session.usage.totalTokens;
        acc.estimatedCost += session.usage.estimatedCost;
        return acc;
      },
      { requests: 0, totalTokens: 0, estimatedCost: 0 },
    );

    return {
      plan: user.plan,
      usage,
      invoices: [
        {
          id: 'inv-1',
          status: 'paid',
          amount: 29,
          period: 'March 2026',
        },
      ],
      limits: {
        monthlyRequests: 10000,
        modelAccess: 'full',
      },
    };
  }

  private requireUser(req: Request) {
    return requireAuthenticatedUser(req);
  }

  private getUserSessions(userId: string) {
    return mockDb.chatSessions
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  private buildDashboardOverview(
    user: ReturnType<typeof requireAuthenticatedUser>,
    sessions: ReturnType<DashboardService['getUserSessions']>,
  ) {
    const usage = sessions.reduce(
      (acc, session) => {
        acc.requests += session.usage.requests;
        acc.sessions += 1;
        acc.totalTokens += session.usage.totalTokens;
        acc.estimatedCost += session.usage.estimatedCost;
        return acc;
      },
      { requests: 0, sessions: 0, totalTokens: 0, estimatedCost: 0 },
    );

    return {
      user,
      usage,
      recentSessions: sessions.slice(0, 5).map((session) => ({
        id: session.id,
        title: session.title,
        modelName: session.modelName,
        updatedAt: session.updatedAt,
        totalTokens: session.usage.totalTokens,
      })),
      profile: {
        plan: user?.plan ?? 'free',
        workspaceName: `${user?.name ?? 'Workspace'} AI Hub`,
      },
    };
  }
}
