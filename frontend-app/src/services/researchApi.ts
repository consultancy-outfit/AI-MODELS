import { baseApi } from './baseApi';
import type { ResearchItem, ResearchFilters } from '@/interface';

export const researchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResearchFeed: builder.query<ResearchItem[], ResearchFilters | void>({
      query: (filters) => {
        const safeFilters: ResearchFilters = filters ?? {};
        const params = new URLSearchParams();
        if (safeFilters.lab) params.set('lab', safeFilters.lab);
        if (safeFilters.topic) params.set('topic', safeFilters.topic);
        if (safeFilters.page) params.set('page', String(safeFilters.page));
        return `/research?${params.toString()}`;
      },
      providesTags: ['Research'],
      keepUnusedDataFor: 900,
    }),
    getResearchItem: builder.query<ResearchItem, string>({
      query: (id) => `/research/${id}`,
      providesTags: (_, __, id) => [{ type: 'Research', id }],
      keepUnusedDataFor: 900,
    }),
  }),
  overrideExisting: false,
});

export const { useGetResearchFeedQuery, useGetResearchItemQuery } = researchApi;
