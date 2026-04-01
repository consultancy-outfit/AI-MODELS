import { baseApi } from './baseApi';
import type { Agent, AgentDraft, AgentTool } from '../types/agent.types';

export const agentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query<Agent[], void>({
      query: () => '/agents',
      providesTags: ['Agent'],
      keepUnusedDataFor: 1200,
    }),
    getAgentById: builder.query<Agent, string>({
      query: (id) => `/agents/${id}`,
      providesTags: (_, __, id) => [{ type: 'Agent', id }],
      keepUnusedDataFor: 1200,
    }),
    createAgent: builder.mutation<Agent, AgentDraft>({
      query: (body) => ({ url: '/agents', method: 'POST', body }),
      invalidatesTags: ['Agent'],
    }),
    updateAgent: builder.mutation<Agent, { id: string } & Partial<AgentDraft>>({
      query: ({ id, ...body }) => ({ url: `/agents/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Agent', id }],
    }),
    deleteAgent: builder.mutation<void, string>({
      query: (id) => ({ url: `/agents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Agent'],
    }),
    getAvailableTools: builder.query<AgentTool[], void>({
      query: () => '/agents/tools',
      keepUnusedDataFor: 3600,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAgentsQuery, useGetAgentByIdQuery, useCreateAgentMutation, useUpdateAgentMutation, useDeleteAgentMutation, useGetAvailableToolsQuery } = agentsApi;
