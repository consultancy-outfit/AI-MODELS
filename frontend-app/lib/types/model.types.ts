export type ModelCategory = 'language' | 'vision' | 'code' | 'image' | 'audio' | 'video' | 'multimodal';
export type PricingTier = 'free' | 'pay-as-you-go' | 'pro' | 'enterprise';
export type BadgeType = 'new' | 'hot' | 'open' | 'beta' | '';

export interface Model {
  id: string;
  name: string;
  lab: string;
  org: string;
  description: string;
  tags: string[];
  categories: ModelCategory[];
  contextWindow: string;
  pricingTier: PricingTier;
  pricePerMToken: number;
  priceDisplay: string;
  rating: number;
  reviewCount: number;
  badge: BadgeType;
  icon: string;
  bgColor: string;
  isNew: boolean;
  isTrending: boolean;
  capabilities: string[];
  updatedAt: string;
}

export interface ModelFilters {
  lab?: string[];
  category?: string;
  search?: string;
  pricingTier?: string[];
  page?: number;
  limit?: number;
}

export interface PaginatedModels {
  items: Model[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Lab {
  id: string;
  name: string;
  icon: string;
  color: string;
  modelCount: number;
}

export interface ModelVariation {
  id: string;
  name: string;
  tag: string;
  icon: string;
  description: string;
  contextWindow: string;
  speed: string;
  pricing: string;
  updatedAt: string;
  badge: string;
  benefits: string[];
}
