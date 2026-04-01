import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { requireAuthenticatedUser } from '../../common/auth/auth.helpers';
import {
  buildMockAssistantReply,
  buildSessionTitle,
  buildSessionUsage,
  estimateTokens,
  findMockModel,
  mockDb,
} from '../../store/mock-db';
import type { ImportPayload, MessagePayload, SessionPayload } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(private readonly configService: ConfigService) {}

  createSession(body: SessionPayload, req: Request) {
    const { userId, guestSessionId } = this.resolveIdentity(req, body.guestSessionId);
    const model = this.requireModel(body.modelId);
    const title = body.title?.trim() || model.name;
    const systemPrompt = body.systemPrompt?.trim() || model.systemPrompt;
    const now = new Date().toISOString();
    const session = {
      id: randomUUID(),
      userId,
      guestSessionId,
      modelId: model.id,
      modelName: model.name,
      provider: model.provider,
      title,
      systemPrompt,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: randomUUID(),
          role: 'system' as const,
          content: systemPrompt,
          createdAt: now,
          tokens: estimateTokens(systemPrompt),
        },
      ],
      usage: {
        requests: 0,
        promptTokens: estimateTokens(systemPrompt),
        completionTokens: 0,
        totalTokens: estimateTokens(systemPrompt),
        avgLatencyMs: 0,
        estimatedCost: 0,
      },
    };
    mockDb.chatSessions.unshift(session);
    return this.formatSession(session);
  }

  importGuestSessions(body: ImportPayload, req: Request) {
    const userId = this.resolveUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Sign in to import guest history.');
    }

    const imported = body.sessions.map((incoming) => {
      const model = this.requireModel(incoming.modelId);
      const now = new Date().toISOString();
      const messages =
        incoming.messages?.map((message) => ({
          id: randomUUID(),
          role: message.role,
          content: message.content,
          createdAt: now,
          tokens: estimateTokens(message.content),
        })) ?? [];
      const session = {
        id: incoming.id ?? randomUUID(),
        userId,
        guestSessionId: body.guestSessionId,
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        title: incoming.title?.trim() || buildSessionTitle(messages[0]?.content ?? model.name, model.name),
        systemPrompt: incoming.systemPrompt?.trim() || model.systemPrompt,
        createdAt: now,
        updatedAt: now,
        messages,
        usage: {
          requests: messages.filter((message) => message.role === 'user').length,
          promptTokens: messages
            .filter((message) => message.role !== 'assistant')
            .reduce((sum, message) => sum + (message.tokens ?? estimateTokens(message.content)), 0),
          completionTokens: messages
            .filter((message) => message.role === 'assistant')
            .reduce((sum, message) => sum + (message.tokens ?? estimateTokens(message.content)), 0),
          totalTokens: messages.reduce((sum, message) => sum + (message.tokens ?? estimateTokens(message.content)), 0),
          avgLatencyMs: 0,
          estimatedCost: 0,
        },
      };
      session.usage = buildSessionUsage(session);
      mockDb.chatSessions.unshift(session);
      return this.formatSession(session);
    });

    return { imported: imported.length, sessions: imported };
  }

  async send(body: MessagePayload, req: Request) {
    const { userId, guestSessionId } = this.resolveIdentity(req, body.guestSessionId);
    const model = this.requireModel(body.modelId);
    const now = new Date().toISOString();
    const session = this.findOrCreateSession(body.sessionId, {
      userId,
      guestSessionId,
      modelId: model.id,
      title: model.name,
      systemPrompt: body.systemPrompt?.trim() || model.systemPrompt,
    });

    session.userId = userId;
    session.guestSessionId = guestSessionId ?? session.guestSessionId;
    session.modelId = model.id;
    session.modelName = model.name;
    session.provider = model.provider;
    if (!session.title || session.title === 'New Chat') {
      session.title = buildSessionTitle(body.content, model.name);
    }
    session.systemPrompt = body.systemPrompt?.trim() || session.systemPrompt || model.systemPrompt;
    session.updatedAt = now;
    if (session.messages.length === 0) {
      session.messages.push({
        id: randomUUID(),
        role: 'system',
        content: session.systemPrompt,
        createdAt: now,
        tokens: estimateTokens(session.systemPrompt),
      });
    }

    const userMessage = {
      id: randomUUID(),
      role: 'user' as const,
      content: body.content,
      attachments: body.attachments ?? [],
      createdAt: now,
      tokens: estimateTokens(body.content),
    };
    const forwarded = await this.forwardToMl({
      modelId: model.id,
      provider: model.provider,
      content: body.content,
      systemPrompt: session.systemPrompt,
      mode: body.mode ?? 'text',
      audioUrl: body.audioUrl ?? null,
      attachments: body.attachments ?? [],
      sessionId: session.id,
    });
    const assistantContent =
      forwarded?.message ||
      buildMockAssistantReply({
        modelId: model.id,
        content: body.content,
        systemPrompt: session.systemPrompt,
      });
    const assistantMessage = {
      id: randomUUID(),
      role: 'assistant' as const,
      content: assistantContent,
      createdAt: now,
      tokens: estimateTokens(assistantContent),
    };

    session.messages.push(userMessage, assistantMessage);
    session.usage = buildSessionUsage(session);

    return {
      session: this.formatSession(session),
      assistantMessage,
      usage: session.usage,
      model: {
        id: model.id,
        name: model.name,
        provider: model.provider,
        contextWindow: model.contextWindow,
        priceDisplay: model.priceDisplay,
        rating: model.rating,
      },
      forwardedToMl: Boolean(forwarded),
    };
  }

  history(sessionId: string | undefined, guestSessionId: string | undefined, req?: Request) {
    const userId = req ? this.resolveUserId(req) : undefined;
    const sessions = mockDb.chatSessions.filter((entry) => {
      if (sessionId) return entry.id === sessionId;
      if (userId) return entry.userId === userId;
      if (guestSessionId) return entry.guestSessionId === guestSessionId;
      return !entry.userId && !entry.guestSessionId;
    });

    if (sessionId) {
      return this.formatSession(sessions[0] ?? null);
    }

    return {
      items: sessions.map((session) => this.formatSession(session)),
      total: sessions.length,
    };
  }

  getSession(sessionId: string) {
    const session = mockDb.chatSessions.find((entry) => entry.id === sessionId);
    if (!session) {
      throw new NotFoundException('Chat session not found.');
    }
    return this.formatSession(session);
  }

  delete(id: string, req: Request) {
    const userId = this.resolveUserId(req);
    const index = mockDb.chatSessions.findIndex((entry) => entry.id === id && (!userId || entry.userId === userId));
    if (index < 0) {
      throw new NotFoundException('Session not found.');
    }
    mockDb.chatSessions.splice(index, 1);
    return { deleted: true };
  }

  private async forwardToMl(payload: Record<string, unknown>) {
    const mlApiUrl = this.configService.get<string>('ML_TEAM_API_URL');
    if (!mlApiUrl) return null;

    try {
      const response = await axios.post(`${mlApiUrl.replace(/\/$/, '')}/chat/send`, payload, {
        timeout: 12000,
      });
      return response.data;
    } catch {
      return null;
    }
  }

  private resolveIdentity(req: Request, guestSessionId?: string) {
    return {
      userId: this.resolveUserId(req),
      guestSessionId: this.resolveGuestSessionId(req, guestSessionId),
    };
  }

  private resolveUserId(req: Request) {
    return req.user ? requireAuthenticatedUser(req).id : undefined;
  }

  private resolveGuestSessionId(req: Request, bodyGuestSessionId?: string) {
    if (bodyGuestSessionId) {
      return bodyGuestSessionId;
    }

    const rawCookie = req.headers.cookie;
    if (!rawCookie) return undefined;

    const match = rawCookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('nexusai_guest_expires='));
    return match ? 'guest-session' : undefined;
  }

  private requireModel(modelId: string) {
    const model = findMockModel(modelId);
    if (!model) {
      throw new NotFoundException(`Model ${modelId} not found.`);
    }
    return model;
  }

  private findOrCreateSession(
    sessionId: string,
    seed: { userId?: string; guestSessionId?: string; modelId: string; title: string; systemPrompt: string },
  ) {
    const existing = mockDb.chatSessions.find((entry) => entry.id === sessionId);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const model = this.requireModel(seed.modelId);
    const session = {
      id: sessionId || randomUUID(),
      userId: seed.userId,
      guestSessionId: seed.guestSessionId,
      modelId: seed.modelId,
      modelName: model.name,
      provider: model.provider,
      title: seed.title,
      systemPrompt: seed.systemPrompt,
      createdAt: now,
      updatedAt: now,
      messages: [],
      usage: {
        requests: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        avgLatencyMs: 0,
        estimatedCost: 0,
      },
    };
    mockDb.chatSessions.unshift(session);
    return session;
  }

  private formatSession(session: (typeof mockDb.chatSessions)[number] | null) {
    if (!session) return null;
    return {
      ...session,
      messages: session.messages,
    };
  }
}
