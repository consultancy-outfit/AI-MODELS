export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  appName: 'NexusAI',
  appDescription: 'Discover, test, and deploy cutting-edge AI models',
} as const;
