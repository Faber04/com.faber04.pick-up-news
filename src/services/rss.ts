import { RSSFeed, RSSItem, NewsItem } from '../types';

export class RSSService {
  static async fetchFeed(url: string): Promise<RSSItem[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xmlText = await response.text();
      return this.parseRSSFeed(xmlText);
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      throw new Error(`Failed to fetch RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parseRSSFeed(xmlText: string): RSSItem[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check if it's RSS or Atom
    const rssItems = xmlDoc.querySelectorAll('rss channel item');
    if (rssItems.length > 0) {
      return Array.from(rssItems).map(item => this.parseRSSItem(item));
    }

    // Try Atom format
    const atomEntries = xmlDoc.querySelectorAll('feed entry');
    if (atomEntries.length > 0) {
      return Array.from(atomEntries).map(entry => this.parseAtomEntry(entry));
    }

    return [];
  }

  static parseRSSItem(item: Element): RSSItem {
    const getTextContent = (selector: string): string => {
      const element = item.querySelector(selector);
      return element?.textContent?.trim() || '';
    };

    return {
      title: getTextContent('title'),
      link: getTextContent('link'),
      contentSnippet: getTextContent('description'),
      summary: getTextContent('description'),
      pubDate: getTextContent('pubDate'),
      isoDate: this.parseDate(getTextContent('pubDate')),
      guid: getTextContent('guid'),
      creator: getTextContent('author') || getTextContent('creator'),
      categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent?.trim() || ''),
    };
  }

  static parseAtomEntry(entry: Element): RSSItem {
    const getTextContent = (selector: string): string => {
      const element = entry.querySelector(selector);
      return element?.textContent?.trim() || '';
    };

    const getAttribute = (selector: string, attr: string): string => {
      const element = entry.querySelector(selector);
      return element?.getAttribute(attr) || '';
    };

    return {
      title: getTextContent('title'),
      link: getAttribute('link[rel="alternate"]', 'href') || getTextContent('link'),
      contentSnippet: getTextContent('summary') || getTextContent('content'),
      summary: getTextContent('summary') || getTextContent('content'),
      pubDate: getTextContent('published') || getTextContent('updated'),
      isoDate: getTextContent('published') || getTextContent('updated'),
      guid: getTextContent('id'),
      creator: getTextContent('author name'),
      categories: Array.from(entry.querySelectorAll('category')).map(cat => cat.getAttribute('term') || ''),
    };
  }

  static parseDate(dateString: string): string | undefined {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch {
      return undefined;
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