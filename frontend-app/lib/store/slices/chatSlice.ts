import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatSession, Message, InputMode } from '@/lib/types/chat.types';

interface ChatState {
  activeModelId: string | null;
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  isStreaming: boolean;
  inputMode: InputMode;
  voiceModeActive: boolean;
}

const initialState: ChatState = {
  activeModelId: null,
  sessions: {},
  currentSessionId: null,
  isStreaming: false,
  inputMode: 'text',
  voiceModeActive: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveModel: (state, action: PayloadAction<string>) => {
      state.activeModelId = action.payload;
    },
    startSession: (state, action: PayloadAction<ChatSession>) => {
      const session = action.payload;
      state.sessions[session.id] = session;
      state.currentSessionId = session.id;
    },
    appendMessage: (state, action: PayloadAction<{ sessionId: string; message: Message }>) => {
      const { sessionId, message } = action.payload;
      if (state.sessions[sessionId]) {
        state.sessions[sessionId].messages.push(message);
        state.sessions[sessionId].updatedAt = new Date().toISOString();
      }
    },
    updateLastMessage: (state, action: PayloadAction<{ sessionId: string; content: string }>) => {
      const { sessionId, content } = action.payload;
      const session = state.sessions[sessionId];
      if (session && session.messages.length > 0) {
        const last = session.messages[session.messages.length - 1];
        if (last.role === 'assistant') last.content = content;
      }
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    setInputMode: (state, action: PayloadAction<InputMode>) => {
      state.inputMode = action.payload;
    },
    toggleVoiceMode: (state) => {
      state.voiceModeActive = !state.voiceModeActive;
      if (state.voiceModeActive) state.inputMode = 'voice';
      else state.inputMode = 'text';
    },
  },
});

export const { setActiveModel, startSession, appendMessage, updateLastMessage, setStreaming, setInputMode, toggleVoiceMode } = chatSlice.actions;
export default chatSlice.reducer;
