import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { mockDb } from '../../store/mock-db';
import { mockModels } from '../../store/mock-models';
import type { HomeFeedPayload } from './models.schema';

@Injectable()
export class ModelsService {
  private homeFeedCache: { payload: HomeFeedPayload; expiresAt: number } | null = null;
  private readonly refreshAfterMs = 15 * 60 * 1000;

  constructor(private readonly configService: ConfigService) {}

  getModels(search?: string, category?: string, page = '1', limit = '24') {
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 24;
    const filtered = mockModels.filter((model) => {
      const matchesSearch =
        !search ||
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.provider.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || model.category === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    return {
      items: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
      total: filtered.length,
      page: currentPage,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }

  getModel(id: string) {
    return mockModels.find((model) => model.id === id) ?? null;
  }

  async getHomeFeed() {
    if (this.homeFeedCache && this.homeFeedCache.expiresAt > Date.now()) {
      return this.homeFeedCache.payload;
    }

    const mlApiUrl = this.configService.get<string>('ML_TEAM_API_URL');
    const payload: HomeFeedPayload = mlApiUrl
      ? (await this.fetchMlHomeFeed(mlApiUrl)) ?? this.buildDummyHomeFeed()
      : this.buildDummyHomeFeed();

    this.homeFeedCache = {
      payload,
      expiresAt: Date.now() + this.refreshAfterMs,
    };
    return payload;
  }

  private async fetchMlHomeFeed(mlApiUrl: string) {
    try {
      const response = await axios.get<HomeFeedPayload>(`${mlApiUrl.replace(/\/$/, '')}/home-feed`, {
        timeout: 6000,
      });
      return {
        ...response.data,
        refreshedAt: new Date().toISOString(),
        refreshAfterMs: this.refreshAfterMs,
        source: 'ml' as const,
      };
    } catch {
      return null;
    }
  }

  private buildDummyHomeFeed(): HomeFeedPayload {
    const labs = Array.from(new Set(mockModels.map((model) => model.provider)));
    const featuredModels = mockModels.slice(0, 6).map((model) => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      rating: model.rating,
      reviews: model.reviews,
      priceDisplay: model.priceDisplay,
      contextWindow: model.contextWindow,
      tags: model.tags.slice(0, 3),
    }));

    const builtForEveryBuilder = [
      { title: 'Writers', body: 'Draft landing pages, launch notes, and product messaging.' },
      { title: 'Developers', body: 'Compare code-capable models and move faster with agentic flows.' },
      { title: 'Analysts', body: 'Summarize data-heavy outputs and benchmark the right model mix.' },
      { title: 'Designers', body: 'Generate creative directions, image briefs, and visual prompts.' },
      { title: 'Support Teams', body: 'Route the right model to ticketing, chat, and knowledge workflows.' },
    ];

    const browseByAiLab = labs.slice(0, 10).map((provider) => ({
      provider,
      count: mockModels.filter((model) => model.provider === provider).length,
    }));

    const flagshipModelComparison = mockModels.slice(0, 8).map((model) => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      contextWindow: model.contextWindow,
      priceDisplay: model.priceDisplay,
      rating: model.rating,
      maxOutputTokens: model.maxOutputTokens,
      capabilities: model.capabilities,
    }));

    const trendingThisWeek = mockModels.slice(8, 14).map((model, index) => ({
      id: model.id,
      title: `${model.name} is rising in ${model.category}`,
      provider: model.provider,
      body: `Momentum signal ${index + 1}: ${model.description}`,
    }));

    const firstModelsByBudget = [
      { label: 'Budget pick', detail: featuredModels[0] },
      { label: 'Balanced', detail: featuredModels[1] },
      { label: 'Premium', detail: featuredModels[2] },
      { label: 'Creative', detail: featuredModels[3] },
    ];

    const quickStartUseCases = [
      { title: 'Customer Support', description: 'Launch a guided support copilot quickly.' },
      { title: 'Content Creation', description: 'Draft copy, scripts, and social assets.' },
      { title: 'Document Analysis', description: 'Summarize files and extract structured data.' },
      { title: 'Code Generation', description: 'Compare code assistants before rollout.' },
    ];

    return {
      featuredModels,
      builtForEveryBuilder,
      browseByAiLab,
      flagshipModelComparison,
      trendingThisWeek,
      firstModelsByBudget,
      quickStartUseCases,
      refreshedAt: new Date().toISOString(),
      refreshAfterMs: this.refreshAfterMs,
      source: 'dummy',
    };
  }
}
