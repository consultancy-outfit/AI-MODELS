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
