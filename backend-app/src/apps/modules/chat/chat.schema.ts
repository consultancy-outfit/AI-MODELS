export type MessagePayload = {
  sessionId: string;
  modelId: string;
  content: string;
  systemPrompt?: string;
  guestSessionId?: string;
  mode?: string;
  attachments?: Array<Record<string, unknown>>;
  audioUrl?: string;
};

export type SessionPayload = {
  modelId: string;
  title?: string;
  systemPrompt?: string;
  guestSessionId?: string;
};

export type ImportPayload = {
  guestSessionId: string;
  sessions: Array<{
    id?: string;
    modelId: string;
    title?: string;
    systemPrompt?: string;
    messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  }>;
};
