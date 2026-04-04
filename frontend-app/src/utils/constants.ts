export const LAB_LIST = [
  { id: 'all', name: 'All Labs', icon: '🔍', color: '#1C1A16' },
  { id: 'OpenAI', name: 'OpenAI', icon: '🧠', color: '#10A37F' },
  { id: 'Anthropic', name: 'Anthropic', icon: '⚡', color: '#C8622A' },
  { id: 'Google', name: 'Google DeepMind', icon: '🔬', color: '#4285F4' },
  { id: 'Meta', name: 'Meta', icon: '🦙', color: '#0866FF' },
  { id: 'DeepSeek', name: 'DeepSeek', icon: '💻', color: '#2E9E5B' },
  { id: 'Alibaba', name: 'Alibaba (Qwen)', icon: '🌏', color: '#FF6A00' },
  { id: 'xAI', name: 'xAI / Grok', icon: '𝕏', color: '#1a1a1a' },
  { id: 'Mistral', name: 'Mistral AI', icon: '🌊', color: '#5A5750' },
];

export const CATEGORY_LIST = [
  { id: 'all', label: 'All' },
  { id: 'language', label: 'Language' },
  { id: 'vision', label: 'Vision' },
  { id: 'code', label: 'Code' },
  { id: 'image', label: 'Image Gen' },
  { id: 'audio', label: 'Audio' },
  { id: 'open', label: 'Open Source' },
];

export const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  new:  { bg: 'rgba(10,94,73,0.1)',   color: '#0A5E49' },
  hot:  { bg: 'rgba(200,98,42,0.1)',  color: '#C8622A' },
  open: { bg: 'rgba(30,77,168,0.1)',  color: '#1E4DA8' },
  beta: { bg: 'rgba(138,90,0,0.1)',   color: '#8A5A00' },
};

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/csv'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const CHAT_CATEGORY_PROMPTS = {
  use_cases: [
    'Help me find the best AI model for my project',
    'I want to build an AI chatbot for my website',
    'Generate realistic images for my marketing campaign',
    'Analyse documents and extract key information',
    'Create AI agents for workflow automation',
    'Add voice and speech recognition to my app',
  ],
  create: [
    'Write a blog post about AI trends in my industry',
    'Create social media captions for my product launch',
    'Generate an email newsletter for my audience',
    'Write a product description that converts',
    'Create an infographic script on a complex topic',
    'Draft a script for a 2-minute explainer video',
  ],
  analyze: [
    'Analyse this dataset and summarise key insights',
    'Compare the top AI models by performance and cost',
    'Research the competitive landscape in my market',
    'Identify trends from my customer feedback data',
  ],
  learn: [
    'Explain how large language models work simply',
    'Teach me prompt engineering from scratch',
    'What is RAG and when should you use it?',
    'Help me understand AI agent architectures',
  ],
};
