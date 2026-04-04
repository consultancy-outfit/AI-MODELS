export const paths = {
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
  },
  main: {
    home: '/',
    chat: '/chat',
    marketplace: '/marketplace',
    discover: '/discover',
    agents: '/agents',
    dashboard: {
      root: '/dashboard',
      billing: '/dashboard/billing',
      history: '/dashboard/history',
      settings: '/dashboard/settings',
    },
  },
} as const;
