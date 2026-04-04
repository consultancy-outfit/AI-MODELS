import { baseApi } from './baseApi';

type HomeFeed = {
  featuredModels: Array<{
    id: string;
    name: string;
    provider: string;
    rating: number;
    reviews: number;
    priceDisplay: string;
    contextWindow: string;
    tags: string[];
  }>;
  builtForEveryBuilder: Array<{ title: string; body: string }>;
  browseByAiLab: Array<{ provider: string; count: number }>;
  flagshipModelComparison: Array<{
    id: string;
    name: string;
    provider: string;
    contextWindow: string;
    priceDisplay: string;
    rating: number;
    tokenLimit: number;
    capabilities: string[];
  }>;
  trendingThisWeek: Array<{ id: string; title: string; provider: string; body: string }>;
  firstModelsByBudget: Array<{ label: string; detail: { name: string; provider: string; priceDisplay: string } }>;
  quickStartUseCases: Array<{ title: string; description: string }>;
  refreshedAt: string;
  refreshAfterMs: number;
  source: 'dummy' | 'ml';
};

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeFeed: builder.query<HomeFeed, void>({
      query: () => '/models/home-feed',
      keepUnusedDataFor: 900,
    }),
  }),
});

export const { useGetHomeFeedQuery } = homeApi;
