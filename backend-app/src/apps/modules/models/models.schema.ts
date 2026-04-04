export type HomeFeedPayload = {
  featuredModels: Array<Record<string, unknown>>;
  builtForEveryBuilder: Array<Record<string, unknown>>;
  browseByAiLab: Array<Record<string, unknown>>;
  flagshipModelComparison: Array<Record<string, unknown>>;
  trendingThisWeek: Array<Record<string, unknown>>;
  firstModelsByBudget: Array<Record<string, unknown>>;
  quickStartUseCases: Array<Record<string, unknown>>;
  refreshedAt: string;
  refreshAfterMs: number;
  source: 'dummy' | 'ml';
};
