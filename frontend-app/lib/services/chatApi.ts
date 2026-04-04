import { baseApi } from './baseApi';
import type {
  ChatSession,
  Message,
  SendMessagePayload,
  ChatConfig,
  ChatSendResponse,
  ChatHistoryResponse,
} from '../types/chat.types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation<ChatSession, { modelId: string }>({
      query: (body) => ({ url: '/chat/session', method: 'POST', body }),
    }),
    sendMessage: builder.mutation<ChatSendResponse, SendMessagePayload>({
      query: (body) => ({ url: '/chat/send', method: 'POST', body }),
    }),
    getChatHistory: builder.query<ChatHistoryResponse | ChatSession | null, { sessionId?: string; guestSessionId?: string } | void>({
      query: (params) =>
        params
          ? { url: '/chat/history', params }
          : '/chat/history',
      keepUnusedDataFor: 0,
    }),
    importGuestSessions: builder.mutation<
      { imported: number; sessions: ChatSession[] },
      {
        guestSessionId: string;
        sessions: Array<{
          id?: string;
          modelId: string;
          title?: string;
          systemPrompt?: string;
          messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
        }>;
      }
    >({
      query: (body) => ({ url: '/chat/session/import', method: 'POST', body }),
    }),
    getModelConfig: builder.query<ChatConfig, string>({
      query: (modelId) => `/chat/config/${modelId}`,
      keepUnusedDataFor: 1800,
    }),
    deleteSession: builder.mutation<{ deleted: boolean }, string>({
      query: (sessionId) => ({ url: `/chat/session/${sessionId}`, method: 'DELETE' }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateSessionMutation,
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useGetModelConfigQuery,
  useDeleteSessionMutation,
  useImportGuestSessionsMutation,
} = chatApi;
