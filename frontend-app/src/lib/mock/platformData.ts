import type { Agent } from '@/interface';
import type { Model } from '@/interface';

const providers = [
  { name: 'OpenAI', color: '#10A37F' },
  { name: 'Anthropic', color: '#C8622A' },
  { name: 'Google DeepMind', color: '#4285F4' },
  { name: 'Meta', color: '#0866FF' },
  { name: 'Mistral', color: '#5A5750' },
  { name: 'xAI', color: '#111111' },
  { name: 'DeepSeek', color: '#2E9E5B' },
  { name: 'Qwen', color: '#FF6A00' },
  { name: 'Cohere', color: '#7A5AF8' },
  { name: 'Stability', color: '#6D28D9' },
];

const categories = [
  { id: 'language', label: 'Language' },
  { id: 'vision', label: 'Vision' },
  { id: 'code', label: 'Code' },
  { id: 'image', label: 'Image Gen' },
  { id: 'audio', label: 'Audio' },
  { id: 'multimodal', label: 'Multimodal' },
] as const;

const adjectives = ['Swift', 'Prime', 'Ultra', 'Nova', 'Atlas', 'Pulse', 'Core'];
const nouns = ['Reasoner', 'Studio', 'Coder', 'Vision', 'Composer', 'Agent', 'Search'];

export const languages = [
  'English',
  'Urdu',
  'Arabic',
  'Spanish',
  'French',
  'German',
];

export const promptGuides = [
  'Ask for a step-by-step answer with output format constraints.',
  'Attach a file or image and ask for extraction or comparison.',
  'Switch models when you need vision, coding, or long-context support.',
  'Use quick actions to generate a prompt when the active model lacks a feature.',
];

export const quickActionGroups = [
  {
    title: 'Navigation & Tools',
    actions: ['Search the web', 'Summarize file', 'Create agent', 'Export notes'],
  },
  {
    title: 'Create & Generate',
    actions: ['Write product copy', 'Generate code plan', 'Create image brief', 'Draft email'],
  },
  {
    title: 'Analyze & Write',
    actions: ['Compare vendors', 'Analyze CSV', 'Review contract', 'Research trend'],
  },
];

export const suggestedPrompts = [
  'Compare the best reasoning models for a customer support copilot.',
  'Create a rollout plan for adding AI search into my SaaS product.',
  'Analyze this PDF and list the action items by priority.',
  'Design a multi-agent workflow for onboarding and support.',
];

export const recommendedPrompts = [
  'Write a launch announcement for our AI-powered feature.',
  'Compare OpenAI, Anthropic, and Gemini for code review.',
  'Summarize this meeting transcript into decisions and risks.',
  'Design a prompt chain for invoice extraction and review.',
];

export const featuredProviders = providers.slice(0, 6);

export const agents: Agent[] = [
  {
    id: 'support-agent',
    name: 'Support Copilot',
    description: 'Answers tickets, drafts replies, and escalates edge cases.',
    baseModelId: 'model-1',
    tools: ['knowledge-base', 'ticket-summary'],
    systemPrompt: 'You are a support copilot. Answer clearly, cite known facts, and escalate risk.',
    temperature: 0.4,
    maxTokens: 3000,
    isPublic: true,
    ownerId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 1240,
  },
  {
    id: 'research-agent',
    name: 'Research Analyst',
    description: 'Turns articles, docs, and reports into concise briefings.',
    baseModelId: 'model-2',
    tools: ['web-search', 'summary'],
    systemPrompt: 'You are a research analyst. Extract signals, trends, and open questions.',
    temperature: 0.3,
    maxTokens: 4000,
    isPublic: true,
    ownerId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 940,
  },
  {
    id: 'growth-agent',
    name: 'Growth Writer',
    description: 'Generates campaign copy, landing page variants, and email drafts.',
    baseModelId: 'model-3',
    tools: ['brand-voice', 'content-plan'],
    systemPrompt: 'You are a growth writer. Keep messaging concrete, persuasive, and on-brand.',
    temperature: 0.7,
    maxTokens: 2800,
    isPublic: true,
    ownerId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 680,
  },
];

export const models: Model[] = Array.from({ length: 420 }, (_, index) => {
  const provider = providers[index % providers.length];
  const category = categories[index % categories.length];
  const adjective = adjectives[index % adjectives.length];
  const noun = nouns[index % nouns.length];
  const isNew = index % 9 === 0;
  const isTrending = index % 7 === 0;
  const price = ((index % 13) + 1) * 0.12;
  const rating = 4.1 + ((index % 8) * 0.1);

  return {
    id: `model-${index + 1}`,
    name: `${provider.name.split(' ')[0]} ${adjective} ${noun} ${index + 1}`,
    lab: provider.name,
    org: provider.name,
    description: `${category.label} model suited for evaluation workflows, production tests, and prompt experimentation.`,
    tags: [category.label, index % 2 === 0 ? 'Fast' : 'Accurate', index % 3 === 0 ? 'Long Context' : 'Low Cost'],
    categories: [category.id],
    contextWindow: `${64 + (index % 8) * 32}K`,
    pricingTier: price < 0.5 ? 'free' : price < 1.2 ? 'pay-as-you-go' : 'pro',
    pricePerMToken: Number(price.toFixed(2)),
    priceDisplay: `$${price.toFixed(2)} / 1M`,
    rating: Number(rating.toFixed(1)),
    reviewCount: 140 + index * 3,
    badge: isTrending ? 'hot' : isNew ? 'new' : index % 5 === 0 ? 'open' : '',
    icon: provider.name[0],
    bgColor: provider.color,
    isNew,
    isTrending,
    capabilities: [
      'chat',
      ...(category.id === 'vision' || category.id === 'multimodal' ? ['vision'] : []),
      ...(category.id === 'audio' ? ['audio'] : []),
      ...(category.id === 'code' ? ['code'] : []),
    ],
    updatedAt: new Date(Date.now() - index * 3_600_000).toISOString(),
  };
});

export const trendingModels = models.filter((model) => model.isTrending).slice(0, 8);
export const newReleases = models.filter((model) => model.isNew && !model.isTrending).slice(0, 8);

export function getActionPrompt(action: string, activeModel: Model) {
  const lower = action.toLowerCase();
  const needsVision = lower.includes('image') || lower.includes('camera');
  const needsAudio = lower.includes('voice') || lower.includes('audio');
  const needsCode = lower.includes('code');

  const supportsVision = activeModel.capabilities.includes('vision');
  const supportsAudio = activeModel.capabilities.includes('audio');
  const supportsCode = activeModel.capabilities.includes('code');

  if ((needsVision && !supportsVision) || (needsAudio && !supportsAudio) || (needsCode && !supportsCode)) {
    return `The selected model is ${activeModel.name}. It does not natively support this action. Create the best facilitation prompt that helps a capable fallback model perform "${action}" while preserving context and intent.`;
  }

  return `Use ${activeModel.name} to perform this action: ${action}. Ask clarifying questions only if essential.`;
}
