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
