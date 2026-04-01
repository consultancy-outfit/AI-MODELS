import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AgentDraft, Agent } from '@/lib/types/agent.types';

interface AgentState {
  draft: AgentDraft | null;
  savedAgents: Agent[];
  buildStatus: 'idle' | 'saving' | 'error';
  error: string | null;
}

const defaultDraft: AgentDraft = {
  name: '',
  description: '',
  baseModelId: '',
  tools: [],
  systemPrompt: '',
  temperature: 0.7,
  maxTokens: 4096,
  isPublic: false,
};

const initialState: AgentState = {
  draft: null,
  savedAgents: [],
  buildStatus: 'idle',
  error: null,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    initDraft: (state, action: PayloadAction<Partial<AgentDraft> | undefined>) => {
      state.draft = { ...defaultDraft, ...(action.payload || {}) };
    },
    updateDraftField: (state, action: PayloadAction<Partial<AgentDraft>>) => {
      if (state.draft) Object.assign(state.draft, action.payload);
    },
    addTool: (state, action: PayloadAction<string>) => {
      if (state.draft && !state.draft.tools.includes(action.payload)) {
        state.draft.tools.push(action.payload);
      }
    },
    removeTool: (state, action: PayloadAction<string>) => {
      if (state.draft) state.draft.tools = state.draft.tools.filter(t => t !== action.payload);
    },
    clearDraft: (state) => { state.draft = null; },
    setBuildStatus: (state, action: PayloadAction<AgentState['buildStatus']>) => {
      state.buildStatus = action.payload;
    },
  },
});

export const { initDraft, updateDraftField, addTool, removeTool, clearDraft, setBuildStatus } = agentSlice.actions;
export default agentSlice.reducer;
