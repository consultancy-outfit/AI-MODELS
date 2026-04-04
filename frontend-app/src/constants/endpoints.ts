export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  models: {
    list: '/models',
    trending: '/models/trending',
    featured: '/models/featured',
    search: '/models/search',
    homeFeed: '/models/home-feed',
    byId: (id: string) => `/models/${id}`,
    variations: (id: string) => `/models/${id}/variations`,
  },
  chat: {
    session: '/chat/session',
    send: '/chat/send',
    history: '/chat/history',
    import: '/chat/session/import',
    config: (modelId: string) => `/chat/config/${modelId}`,
    deleteSession: (sessionId: string) => `/chat/session/${sessionId}`,
  },
  agents: {
    list: '/agents',
    tools: '/agents/tools',
    byId: (id: string) => `/agents/${id}`,
  },
  dashboard: {
    overview: '/dashboard',
    history: '/dashboard/history',
    settings: '/dashboard/settings',
    billing: '/dashboard/billing',
  },
  research: {
    feed: '/research',
    byId: (id: string) => `/research/${id}`,
  },
  labs: '/labs',
} as const;
