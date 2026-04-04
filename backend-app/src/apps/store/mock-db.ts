import { randomUUID } from 'node:crypto';

type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'pro' | 'team';
  createdAt: string;
};

type AuthSessionRecord = {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent?: string;
};

type ModelRecord = {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  contextWindow: string;
  priceDisplay: string;
  rating: number;
  reviews: number;
  tokenLimit: number;
  tags: string[];
  capabilities: string[];
  lab: string;
  systemPrompt: string;
};

type ChatMessageRecord = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  tokens: number;
};

type ChatUsageRecord = {
  requests: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  avgLatencyMs: number;
  estimatedCost: number;
};

type ChatSessionRecord = {
  id: string;
  userId?: string;
  guestSessionId?: string;
  modelId: string;
  modelName: string;
  provider: string;
  title: string;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageRecord[];
  usage: ChatUsageRecord;
};

const now = new Date().toISOString();

const seedModels: ModelRecord[] = [
  {
    id: 'nexus-reasoner-pro',
    name: 'Nexus Reasoner Pro',
    provider: 'OpenAI',
    category: 'reasoning',
    description: 'Best for structured reasoning, planning, and multi-step assistance.',
    contextWindow: '256K',
    priceDisplay: '$0.90 / 1M',
    rating: 4.9,
    reviews: 1284,
    tokenLimit: 262144,
    tags: ['Reasoning', 'Fast', 'Enterprise'],
    capabilities: ['chat', 'reasoning', 'tools'],
    lab: 'OpenAI',
    systemPrompt: 'You are a precise reasoning assistant for product and engineering teams.',
  },
  {
    id: 'vision-atlas',
    name: 'Vision Atlas',
    provider: 'Anthropic',
    category: 'vision',
    description: 'Strong multimodal model for image understanding and document review.',
    contextWindow: '192K',
    priceDisplay: '$1.20 / 1M',
    rating: 4.8,
    reviews: 932,
    tokenLimit: 196608,
    tags: ['Vision', 'Analysis', 'Docs'],
    capabilities: ['chat', 'vision', 'analysis'],
    lab: 'Anthropic',
    systemPrompt: 'You are a multimodal assistant that explains documents and images clearly.',
  },
  {
    id: 'code-pilot-x',
    name: 'Code Pilot X',
    provider: 'Google DeepMind',
    category: 'code',
    description: 'Designed for coding, planning, refactors, and engineering copilots.',
    contextWindow: '128K',
    priceDisplay: '$1.05 / 1M',
    rating: 4.7,
    reviews: 814,
    tokenLimit: 131072,
    tags: ['Code', 'Agents', 'Planning'],
    capabilities: ['chat', 'code', 'planning'],
    lab: 'Google DeepMind',
    systemPrompt: 'You are a senior software engineering copilot.',
  },
  {
    id: 'audio-flow',
    name: 'Audio Flow',
    provider: 'ElevenLabs',
    category: 'audio',
    description: 'Voice-first model for spoken interactions and audio workflows.',
    contextWindow: '64K',
    priceDisplay: '$0.72 / 1M',
    rating: 4.6,
    reviews: 506,
    tokenLimit: 65536,
    tags: ['Audio', 'Voice', 'Narration'],
    capabilities: ['audio', 'speech', 'chat'],
    lab: 'ElevenLabs',
    systemPrompt: 'You help create and interpret spoken and audio-first content.',
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    provider: 'Stability',
    category: 'image',
    description: 'Creative generation model for visual ideation and prompts.',
    contextWindow: '96K',
    priceDisplay: '$0.88 / 1M',
    rating: 4.5,
    reviews: 437,
    tokenLimit: 98304,
    tags: ['Image', 'Creative', 'Prompting'],
    capabilities: ['image', 'creative', 'chat'],
    lab: 'Stability',
    systemPrompt: 'You specialize in creative visual ideation and image prompts.',
  },
  {
    id: 'support-gpt',
    name: 'Support GPT',
    provider: 'Cohere',
    category: 'support',
    description: 'Optimized for support agents, workflows, and high-volume assistance.',
    contextWindow: '128K',
    priceDisplay: '$0.67 / 1M',
    rating: 4.7,
    reviews: 671,
    tokenLimit: 131072,
    tags: ['Support', 'Chat', 'Workflow'],
    capabilities: ['chat', 'support', 'tools'],
    lab: 'Cohere',
    systemPrompt: 'You are a helpful support operations assistant.',
  },
  {
    id: 'deepseek-analyst',
    name: 'DeepSeek Analyst',
    provider: 'DeepSeek',
    category: 'analysis',
    description: 'Great for analytical summaries and cost-sensitive research tasks.',
    contextWindow: '128K',
    priceDisplay: '$0.54 / 1M',
    rating: 4.6,
    reviews: 592,
    tokenLimit: 131072,
    tags: ['Research', 'Analysis', 'Budget'],
    capabilities: ['analysis', 'chat', 'reasoning'],
    lab: 'DeepSeek',
    systemPrompt: 'You are an analytical assistant focused on high-signal summaries.',
  },
  {
    id: 'qwen-omni-flow',
    name: 'Qwen Omni Flow',
    provider: 'Qwen',
    category: 'omni',
    description: 'Versatile multimodal assistant across chat, media, and automation.',
    contextWindow: '256K',
    priceDisplay: '$0.79 / 1M',
    rating: 4.8,
    reviews: 744,
    tokenLimit: 262144,
    tags: ['Omni', 'Multimodal', 'Automation'],
    capabilities: ['chat', 'vision', 'audio'],
    lab: 'Qwen',
    systemPrompt: 'You are a multimodal assistant for broad business workflows.',
  },
];

const seedUsers: UserRecord[] = [
  {
    id: 'user_demo_1',
    name: 'Demo User',
    email: 'demo@nexusai.app',
    password: 'password123',
    plan: 'pro',
    createdAt: now,
  },
];

export const mockDb: {
  users: UserRecord[];
  authSessions: AuthSessionRecord[];
  models: ModelRecord[];
  chatSessions: ChatSessionRecord[];
  uploads: Array<Record<string, unknown>>;
  contactForms: Array<Record<string, unknown>>;
  feedbackForms: Array<Record<string, unknown>>;
} = {
  users: seedUsers,
  authSessions: [],
  models: seedModels,
  chatSessions: [],
  uploads: [],
  contactForms: [],
  feedbackForms: [],
};

export function estimateTokens(content: string) {
  return Math.max(1, Math.ceil(content.trim().length / 4));
}

export function findMockModel(modelId: string) {
  return mockDb.models.find((model) => model.id === modelId) ?? null;
}

export function buildSessionTitle(content: string, fallback: string) {
  const cleaned = content.trim().replace(/\s+/g, ' ');
  if (!cleaned) return fallback;
  return cleaned.length > 44 ? `${cleaned.slice(0, 41)}...` : cleaned;
}

export function buildMockAssistantReply(input: {
  modelId: string;
  content: string;
  systemPrompt?: string;
}) {
  const model = findMockModel(input.modelId);
  const modelName = model?.name ?? 'Selected model';
  return `${modelName} mock response:\n\nI received your request: "${input.content}".\n\nThis backend is currently in mock mode, so this is a simulated assistant reply shaped by the selected model profile.`;
}

export function buildSessionUsage(session: ChatSessionRecord): ChatUsageRecord {
  const promptTokens = session.messages
    .filter((message) => message.role !== 'assistant')
    .reduce((sum, message) => sum + (message.tokens ?? estimateTokens(message.content)), 0);
  const completionTokens = session.messages
    .filter((message) => message.role === 'assistant')
    .reduce((sum, message) => sum + (message.tokens ?? estimateTokens(message.content)), 0);
  const totalTokens = promptTokens + completionTokens;
  const requests = session.messages.filter((message) => message.role === 'user').length;
  return {
    requests,
    promptTokens,
    completionTokens,
    totalTokens,
    avgLatencyMs: requests > 0 ? 950 + requests * 20 : 0,
    estimatedCost: Number((totalTokens * 0.0000025).toFixed(4)),
  };
}

export function issueAccessToken(userId: string) {
  return `access_${userId}_${randomUUID()}`;
}

export function issueRefreshToken(userId: string) {
  return `refresh_${userId}_${randomUUID()}`;
}

export function getUserByAccessToken(accessToken?: string) {
  if (!accessToken) return null;
  const session = mockDb.authSessions.find((entry) => entry.accessToken === accessToken);
  if (!session) return null;
  session.lastActiveAt = new Date().toISOString();
  return mockDb.users.find((user) => user.id === session.userId) ?? null;
}

export function getUserByRefreshToken(refreshToken?: string) {
  if (!refreshToken) return null;
  const session = mockDb.authSessions.find((entry) => entry.refreshToken === refreshToken);
  if (!session) return null;
  session.lastActiveAt = new Date().toISOString();
  return mockDb.users.find((user) => user.id === session.userId) ?? null;
}
