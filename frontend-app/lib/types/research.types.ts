export interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  org: string;
  publishedAt: string;
  tags: string[];
  url?: string;
  isTrending: boolean;
}

export interface ResearchFilters {
  lab?: string;
  topic?: string;
  page?: number;
  limit?: number;
}
