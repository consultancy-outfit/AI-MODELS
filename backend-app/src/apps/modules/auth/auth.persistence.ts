import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setServers as setDnsServers } from 'node:dns';
import { Connection, Model, Schema, connect, models, model } from 'mongoose';
import { mockDb } from '../../store/mock-db';

type AuthUserDoc = {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'pro' | 'team';
  createdAt: string;
};

type AuthSessionDoc = {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent?: string;
};

const authUserSchema = new Schema<AuthUserDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    plan: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false, collection: 'auth_users' },
);

const authSessionSchema = new Schema<AuthSessionDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    accessToken: { type: String, required: true, unique: true, index: true },
    refreshToken: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, required: true },
    lastActiveAt: { type: String, required: true },
    userAgent: { type: String, required: false },
  },
  { versionKey: false, collection: 'auth_sessions' },
);

@Injectable()
export class AuthPersistenceService implements OnModuleInit {
  private readonly logger = new Logger(AuthPersistenceService.name);
  private connection?: Connection;
  private enabled = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('MONGODB_URI');
    const dbName = this.configService.get<string>('MONGODB_DB_NAME');
    const dnsServers = this.configService.get<string>('MONGODB_DNS_SERVERS');

    if (!uri || uri.startsWith('mock://')) {
      this.logger.warn('MongoDB auth persistence is disabled. Using in-memory auth store.');
      return;
    }

    try {
      if (dnsServers) {
        const parsedServers = dnsServers
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);

        if (parsedServers.length > 0) {
          setDnsServers(parsedServers);
          this.logger.log(`Using custom DNS servers for MongoDB resolution: ${parsedServers.join(', ')}`);
        }
      }

      const mongoose = await connect(uri, { dbName });
      this.connection = mongoose.connection;
      this.enabled = true;
      await this.hydrateStore();
      this.logger.log(`MongoDB auth persistence enabled for database ${dbName}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown MongoDB connection error.';
      this.logger.error(`Failed to connect MongoDB auth persistence: ${message}`);
    }
  }

  async syncUser(user: AuthUserDoc) {
    if (!this.enabled) return;
    await this.getUserModel().findOneAndUpdate({ id: user.id }, user, { upsert: true, new: true }).lean();
  }

  async syncSession(session: AuthSessionDoc) {
    if (!this.enabled) return;
    await this.getSessionModel().findOneAndUpdate({ id: session.id }, session, { upsert: true, new: true }).lean();
  }

  async deleteSessionByRefreshToken(refreshToken: string) {
    if (!this.enabled) return;
    await this.getSessionModel().deleteOne({ refreshToken }).lean();
  }

  private async hydrateStore() {
    const userModel = this.getUserModel();
    const sessionModel = this.getSessionModel();
    const users = await userModel.find().lean();
    const sessions = await sessionModel.find().lean();

    if (users.length === 0) {
      for (const user of mockDb.users) {
        await this.syncUser(user);
      }
    } else {
      mockDb.users.splice(0, mockDb.users.length, ...users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        plan: user.plan,
        createdAt: user.createdAt,
      })));
    }

    if (sessions.length > 0) {
      mockDb.authSessions.splice(0, mockDb.authSessions.length, ...sessions.map((session) => ({
        id: session.id,
        userId: session.userId,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
        userAgent: session.userAgent,
      })));
    }
  }

  private getUserModel(): Model<AuthUserDoc> {
    return (models.AuthUser as Model<AuthUserDoc> | undefined) ?? model<AuthUserDoc>('AuthUser', authUserSchema);
  }

  private getSessionModel(): Model<AuthSessionDoc> {
    return (models.AuthSession as Model<AuthSessionDoc> | undefined) ?? model<AuthSessionDoc>('AuthSession', authSessionSchema);
  }
}
