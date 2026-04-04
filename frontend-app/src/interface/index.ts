// ─── Auth Types ──────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface AuthCredentials {
  user: User;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

// ─── Chat Types ───────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant' | 'system';
export type AttachmentType = 'image' | 'document' | 'audio' | 'video';
export type InputMode = 'text' | 'voice' | 'video' | 'screen';

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  url?: string;
  size: number;
  mimeType: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  attachments?: Attachment[];
  timestamp: string;
  createdAt?: string;
  modelId: string;
  tokens?: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  modelId: string;
  title?: string;
  systemPrompt?: string;
  source?: 'guest' | 'server';
  messages: Message[];
  inputMode: InputMode;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  modelId: string;
  sessionId: string;
  content: string;
  attachments?: Pick<Attachment, 'name' | 'type' | 'url' | 'mimeType' | 'size'>[];
  inputMode?: InputMode;
  voiceMode?: boolean;
  systemPrompt?: string;
}

export interface ChatConfig {
  modelId: string;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsVideo: boolean;
  supportsFunctions: boolean;
  maxTokens: number;
  defaultSystemPrompt?: string;
  provider?: string;
  description?: string;
}

export interface ChatUsage {
  requests: number;
  avgLatencyMs: number;
  costEstimate: number;
}

export interface ChatSendResponse {
  session: ChatSession;
  usage: ChatUsage;
}

export interface ChatHistoryResponse {
  items: ChatSession[];
  total: number;
}

// ─── Agent Types ──────────────────────────────────────────────────
export type ToolCategory = 'search' | 'code' | 'data' | 'api' | 'file' | 'communication';

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
}

export interface AgentDraft {
  name: string;
  description: string;
  baseModelId: string;
  tools: string[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  isPublic: boolean;
}

export interface Agent extends AgentDraft {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

// ─── Model Types ──────────────────────────────────────────────────
export type ModelCategory = 'language' | 'vision' | 'code' | 'image' | 'audio' | 'video' | 'multimodal';
export type PricingTier = 'free' | 'pay-as-you-go' | 'pro' | 'enterprise';
export type BadgeType = 'new' | 'hot' | 'open' | 'beta' | '';

export interface Model {
  id: string;
  name: string;
  lab: string;
  org: string;
  description: string;
  tags: string[];
  categories: ModelCategory[];
  contextWindow: string;
  pricingTier: PricingTier;
  pricePerMToken: number;
  priceDisplay: string;
  rating: number;
  reviewCount: number;
  badge: BadgeType;
  icon: string;
  bgColor: string;
  isNew: boolean;
  isTrending: boolean;
  capabilities: string[];
  updatedAt: string;
}

export interface ModelFilters {
  lab?: string[];
  category?: string;
  search?: string;
  pricingTier?: string[];
  page?: number;
  limit?: number;
}

export interface PaginatedModels {
  items: Model[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Lab {
  id: string;
  name: string;
  icon: string;
  color: string;
  modelCount: number;
}

export interface ModelVariation {
  id: string;
  name: string;
  tag: string;
  icon: string;
  description: string;
  contextWindow: string;
  speed: string;
  pricing: string;
  updatedAt: string;
  badge: string;
  benefits: string[];
}

// ─── Research Types ───────────────────────────────────────────────
export interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  org: string;
  publishedAt: string;
  tags: string[];
  url?: string;
  isTrending: boolean;
}

export interface ResearchFilters {
  lab?: string;
  topic?: string;
  page?: number;
  limit?: number;
}

// ─── Speech Types ─────────────────────────────────────────────────
export type SpeechRecognitionEventLite = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

export type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLite) => void) | null;
  start: () => void;
  stop: () => void;
};
