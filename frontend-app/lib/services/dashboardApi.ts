import { baseApi } from './baseApi';

export type DashboardOverview = {
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    createdAt: string;
  } | null;
  usage: {
    requests: number;
    sessions: number;
    estimatedCost: number;
  };
  recentSessions?: Array<{
    id: string;
    title: string;
    modelName: string;
    updatedAt: string;
    totalTokens: number;
  }>;
  profile?: {
    plan: string;
    workspaceName: string;
  };
};

export type DashboardHistoryItem = {
  id: string;
  title: string;
  modelId: string;
  modelName: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  usage: {
    requests: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    avgLatencyMs: number;
    estimatedCost: number;
  };
};

export type DashboardSettings = {
  profile: {
    id: string;
    name: string;
    email: string;
    plan: string;
  };
  preferences: {
    theme: string;
    language: string;
    guestMode: boolean;
    notifications: boolean;
  };
};

export type DashboardBilling = {
  plan: string;
  usage: {
    requests: number;
    totalTokens: number;
    estimatedCost: number;
  };
  invoices: Array<{
    id: string;
    status: string;
    amount: number;
    period: string;
  }>;
  limits: {
    monthlyRequests: number;
    modelAccess: string;
  };
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => '/dashboard',
    }),
    getDashboardHistory: builder.query<{ items: DashboardHistoryItem[]; total: number }, void>({
      query: () => '/dashboard/history',
    }),
    getDashboardSettings: builder.query<DashboardSettings, void>({
      query: () => '/dashboard/settings',
    }),
    getDashboardBilling: builder.query<DashboardBilling, void>({
      query: () => '/dashboard/billing',
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetDashboardHistoryQuery,
  useGetDashboardSettingsQuery,
  useGetDashboardBillingQuery,
} = dashboardApi;
