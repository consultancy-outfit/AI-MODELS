import { baseApi } from './baseApi';
import type { Model, ModelFilters, PaginatedModels, Lab, ModelVariation } from '@/interface';

export const modelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query<PaginatedModels, ModelFilters | void>({
      query: (filters) => {
        const safeFilters: ModelFilters = filters ?? {};
        const params = new URLSearchParams();
        if (safeFilters.lab?.length) params.set('lab', safeFilters.lab.join(','));
        if (safeFilters.category) params.set('category', safeFilters.category);
        if (safeFilters.search) params.set('q', safeFilters.search);
        if (safeFilters.page) params.set('page', String(safeFilters.page));
        if (safeFilters.limit) params.set('limit', String(safeFilters.limit));
        return `/models?${params.toString()}`;
      },
      providesTags: ['Model'],
      keepUnusedDataFor: 1800,
    }),
    getModelById: builder.query<Model, string>({
      query: (id) => `/models/${id}`,
      providesTags: (_, __, id) => [{ type: 'Model', id }],
      keepUnusedDataFor: 1800,
    }),
    getTrendingModels: builder.query<Model[], void>({
      query: () => '/models/trending',
      providesTags: ['Model'],
      keepUnusedDataFor: 1200,
    }),
    getFeaturedModels: builder.query<Model[], void>({
      query: () => '/models/featured',
      providesTags: ['Model'],
      keepUnusedDataFor: 1800,
    }),
    searchModels: builder.query<Model[], string>({
      query: (q) => `/models/search?q=${encodeURIComponent(q)}`,
      keepUnusedDataFor: 300,
    }),
    getLabs: builder.query<Lab[], void>({
      query: () => '/labs',
      providesTags: ['Lab'],
      keepUnusedDataFor: 3600,
    }),
    getModelVariations: builder.query<ModelVariation[], string>({
      query: (modelId) => `/models/${modelId}/variations`,
      keepUnusedDataFor: 1800,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetModelsQuery,
  useGetModelByIdQuery,
  useGetTrendingModelsQuery,
  useGetFeaturedModelsQuery,
  useSearchModelsQuery,
  useGetLabsQuery,
  useGetModelVariationsQuery,
} = modelsApi;
