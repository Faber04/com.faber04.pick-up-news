// RSS Feed types
export interface RSSFeed {
  id: string;
  url: string;
  title: string;
  description?: string;
  lastFetched?: Date;
  error?: string;
}

// RSS Item types (from rss-parser)
export interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  summary?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  categories?: string[];
  enclosure?: {
    url: string;
    length?: number;
    type?: string;
  };
}

// Extended RSS Item with feed info
export interface NewsItem extends RSSItem {
  feedId: string;
  feedTitle: string;
  truncatedDescription: string; // max 120 chars
}

// App state types
export interface AppState {
  feeds: RSSFeed[];
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

// View modes
export type ViewMode = 'chronological' | 'by-feed';

// Filter options
export interface FilterOptions {
  feedId?: string;
  searchTerm?: string;
}