import Parser from 'rss-parser';
import { RSSFeed, RSSItem, NewsItem } from '../types';

const parser = new Parser();

export class RSSService {
  static async fetchFeed(url: string): Promise<RSSItem[]> {
    try {
      const feed = await parser.parseURL(url);
      return feed.items || [];
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      throw new Error(`Failed to fetch RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async fetchAllFeeds(feeds: RSSFeed[]): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    for (const feed of feeds) {
      try {
        const items = await this.fetchFeed(feed.url);
        const newsItems: NewsItem[] = items.map(item => ({
          ...item,
          feedId: feed.id,
          feedTitle: feed.title,
          truncatedDescription: this.truncateDescription(item.contentSnippet || item.summary || '', 120)
        }));
        allNews.push(...newsItems);
      } catch (error) {
        console.error(`Error fetching feed ${feed.title}:`, error);
        // Continue with other feeds
      }
    }

    // Sort by date (newest first)
    return allNews.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate || 0);
      const dateB = new Date(b.isoDate || b.pubDate || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  static truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  static validateFeedUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}