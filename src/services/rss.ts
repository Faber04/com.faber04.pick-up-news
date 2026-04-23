import { RSSFeed, RSSItem, NewsItem } from '../types';

type FeedFormat = 'json' | 'rss' | 'atom';

interface FeedDetectionResult {
  feedUrl: string;
  format: FeedFormat;
}

export class RSSService {
  private static readonly RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
  private static readonly CORSPROXY_API = 'https://corsproxy.io/?url=';
  private static readonly FETCH_TIMEOUT_MS = 10000;
  private static readonly COMMON_FEED_PATHS = [
    '/.well-known/feed.json',
    '/feed.json',
    '/feeds/posts/default?alt=json',
    '/feed',
    '/rss',
    '/rss.xml',
    '/feed.xml',
    '/atom.xml',
    '/index.xml'
  ];

  // Fetch with a timeout to avoid hanging on unresponsive proxies
  private static async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timer);
    }
  }

  // Normalize date strings to ISO format for cross-browser compatibility
  private static normalizeDate(dateStr: string): string {
    if (!dateStr) return '';
    // Convert "YYYY-MM-DD HH:MM:SS" (space) to ISO "YYYY-MM-DDTHH:MM:SS"
    return dateStr.replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2');
  }

  private static parseDate(dateStr: string): Date {
    if (!dateStr) return new Date(0);
    const normalized = this.normalizeDate(dateStr);
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? new Date(0) : d;
  }

  // Parse RSS/Atom XML directly using DOMParser
  static parseXML(xml: string): RSSItem[] {
    // Clean up XML string - remove BOM, trim whitespace
    xml = xml.replace(/^\uFEFF/, '').trim();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    // Check for parse errors
    if (doc.querySelector('parsererror')) {
      // Try to parse as HTML fallback for malformed XML
      const htmlDoc = parser.parseFromString(xml, 'text/html');
      if (!htmlDoc.body) throw new Error('Invalid XML');
      // Return empty array for HTML (not a valid feed)
      return [];
    }

    const items: RSSItem[] = [];

    // RSS 2.0
    const rssItems = doc.querySelectorAll('item');
    if (rssItems.length > 0) {
      rssItems.forEach(item => {
        const getText = (tag: string) => item.querySelector(tag)?.textContent?.trim() || '';
        const pubDate = getText('pubDate');
        items.push({
          title: getText('title'),
          link: getText('link') || item.querySelector('link')?.getAttribute('href') || '',
          contentSnippet: getText('description'),
          summary: getText('description'),
          pubDate,
          isoDate: pubDate,
          guid: getText('guid') || getText('link'),
          creator: getText('dc\\:creator') || getText('author') || '',
          categories: Array.from(item.querySelectorAll('category')).map(c => c.textContent?.trim() || ''),
        });
      });
      return items;
    }

    // Atom feed
    const atomEntries = doc.querySelectorAll('entry');
    atomEntries.forEach(entry => {
      const getText = (tag: string) => entry.querySelector(tag)?.textContent?.trim() || '';
      const pubDate = getText('updated') || getText('published');
      const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href')
        || entry.querySelector('link')?.getAttribute('href')
        || '';
      items.push({
        title: getText('title'),
        link,
        contentSnippet: getText('summary') || getText('content'),
        summary: getText('summary') || getText('content'),
        pubDate,
        isoDate: pubDate,
        guid: getText('id') || link,
        creator: getText('author name') || getText('name') || '',
        categories: [],
      });
    });

    return items;
  }

  private static parseJSONFeed(data: any): RSSItem[] {
    if (!data || typeof data !== 'object') {
      return [];
    }

    if (!Array.isArray(data.items)) {
      return [];
    }

    return data.items.map((item: any) => {
      const pubDate = item.date_published || item.date_modified || '';
      const content = item.content_html || item.content_text || item.summary || '';

      return {
        title: item.title || '',
        link: item.url || item.external_url || '',
        contentSnippet: content,
        summary: content,
        pubDate,
        isoDate: pubDate,
        guid: item.id || item.url || item.external_url || '',
        creator: item.author?.name || '',
        categories: Array.isArray(item.tags) ? item.tags : [],
      };
    });
  }

  private static isLikelyJsonFeed(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const version = typeof data.version === 'string' ? data.version.toLowerCase() : '';
    return version.includes('jsonfeed.org/version/') || Array.isArray(data.items);
  }

  private static isLikelyAtom(xml: string): boolean {
    return /<feed[\s>]/i.test(xml) && /xmlns\s*=\s*["'][^"']*atom/i.test(xml);
  }

  private static resolveUrl(baseUrl: string, candidate: string): string | null {
    if (!candidate) {
      return null;
    }

    try {
      return new URL(candidate, baseUrl).toString();
    } catch {
      return null;
    }
  }

  private static async fetchRawViaCorsproxy(url: string): Promise<string> {
    const apiUrl = `${this.CORSPROXY_API}${encodeURIComponent(url)}`;
    const response = await this.fetchWithTimeout(apiUrl);
    if (!response.ok) throw new Error(`corsproxy HTTP error: ${response.status}`);
    const body = await response.text();
    if (!body || body.trim().length === 0) throw new Error('Empty response from corsproxy');
    return body;
  }

  private static parseFeedContent(raw: string): FeedDetectionResult | null {
    const trimmed = raw.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const json = JSON.parse(trimmed);
        if (this.isLikelyJsonFeed(json)) {
          return {
            feedUrl: '',
            format: 'json'
          };
        }
      } catch {
        return null;
      }
    }

    const parsedItems = this.parseXML(trimmed);
    if (parsedItems.length === 0) {
      return null;
    }

    return {
      feedUrl: '',
      format: this.isLikelyAtom(trimmed) ? 'atom' : 'rss'
    };
  }

  private static async detectDirectFeed(url: string): Promise<FeedDetectionResult | null> {
    try {
      const raw = await this.fetchRawViaCorsproxy(url);
      const parsed = this.parseFeedContent(raw);
      if (!parsed) {
        return null;
      }

      return {
        feedUrl: url,
        format: parsed.format
      };
    } catch {
      return null;
    }
  }

  private static async fetchHtmlDocument(url: string): Promise<Document | null> {
    try {
      const raw = await this.fetchRawViaCorsproxy(url);
      if (raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
        return null;
      }

      const parser = new DOMParser();
      return parser.parseFromString(raw, 'text/html');
    } catch {
      return null;
    }
  }

  private static async detectFromHtml(url: string): Promise<FeedDetectionResult | null> {
    const doc = await this.fetchHtmlDocument(url);
    if (!doc) {
      return null;
    }

    const linkNodes = Array.from(doc.querySelectorAll('link[rel~="alternate"]'));
    const candidates = linkNodes
      .map((link): { href: string; format: FeedFormat | null; priority: number } | null => {
        const href = link.getAttribute('href') || '';
        const type = (link.getAttribute('type') || '').toLowerCase();

        if (!href) {
          return null;
        }

        if (type.includes('application/feed+json') || type.includes('application/json')) {
          return { href, format: 'json', priority: 0 };
        }

        if (type.includes('application/rss+xml')) {
          return { href, format: 'rss', priority: 1 };
        }

        if (type.includes('application/atom+xml')) {
          return { href, format: 'atom', priority: 2 };
        }

        return null;
      })
      .filter((candidate): candidate is { href: string; format: FeedFormat; priority: number } => !!candidate)
      .sort((a, b) => a.priority - b.priority);

    for (const candidate of candidates) {
      const resolved = this.resolveUrl(url, candidate.href);
      if (!resolved) {
        continue;
      }

      const detected = await this.detectDirectFeed(resolved);
      if (detected) {
        return detected;
      }
    }

    return null;
  }

  private static async detectFromCommonPaths(url: string): Promise<FeedDetectionResult | null> {
    let base: URL;
    try {
      base = new URL(url);
    } catch {
      return null;
    }

    for (const path of this.COMMON_FEED_PATHS) {
      const candidateUrl = `${base.origin}${path}`;
      const detected = await this.detectDirectFeed(candidateUrl);
      if (detected) {
        return detected;
      }
    }

    return null;
  }

  private static async detectViaRss2json(url: string): Promise<FeedDetectionResult | null> {
    try {
      const apiUrl = `${this.RSS2JSON_API}?rss_url=${encodeURIComponent(url)}`;
      const response = await this.fetchWithTimeout(apiUrl);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data?.status !== 'ok') {
        return null;
      }

      const resolvedFeedUrl = data?.feed?.url || data?.feed_url || '';
      const normalizedFeedUrl = this.resolveUrl(url, resolvedFeedUrl) || this.normalizeUrl(url);

      // Ensure the detected URL behaves like a feed before accepting it.
      const directCheck = await this.detectDirectFeed(normalizedFeedUrl);
      if (directCheck) {
        return directCheck;
      }

      if (Array.isArray(data?.items) && data.items.length > 0) {
        return {
          feedUrl: normalizedFeedUrl,
          format: 'rss'
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  static async detectFeedUrl(url: string): Promise<FeedDetectionResult | null> {
    const normalizedUrl = this.normalizeUrl(url);

    const direct = await this.detectDirectFeed(normalizedUrl);
    if (direct) {
      return direct;
    }

    const htmlDetected = await this.detectFromHtml(normalizedUrl);
    if (htmlDetected) {
      return htmlDetected;
    }

    const commonPathDetected = await this.detectFromCommonPaths(normalizedUrl);
    if (commonPathDetected) {
      return commonPathDetected;
    }

    return this.detectViaRss2json(normalizedUrl);
  }

  // Fetch via corsproxy.io (raw XML response)
  static async fetchViaCorsproxy(url: string): Promise<RSSItem[]> {
    const raw = await this.fetchRawViaCorsproxy(url);
    const trimmed = raw.trim();

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (this.isLikelyJsonFeed(parsed)) {
          const jsonItems = this.parseJSONFeed(parsed);
          if (jsonItems.length > 0) {
            return jsonItems;
          }
        }
      } catch {
        throw new Error('Invalid JSON feed response');
      }
    }
    
    // Check if response is HTML (error page) instead of XML
    if (trimmed.toLowerCase().startsWith('<!doctype html') || trimmed.toLowerCase().startsWith('<html')) {
      throw new Error('corsproxy returned HTML (likely 404 or error page)');
    }
    
    return this.parseXML(trimmed);
  }

  // Fallback: fetch via rss2json (max 10 items, but reliable)
  static async fetchViaRss2json(url: string): Promise<RSSItem[]> {
    const apiUrl = `${this.RSS2JSON_API}?rss_url=${encodeURIComponent(url)}`;
    const response = await this.fetchWithTimeout(apiUrl);
    const raw = await response.text();

    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`rss2json invalid response (HTTP ${response.status})`);
    }

    if (!response.ok || data?.status !== 'ok') {
      const message = data?.message || `HTTP ${response.status}`;
      throw new Error(`rss2json error: ${message}`);
    }

    return this.parseRSS2JSONFeed(data);
  }

  static async fetchFeed(url: string): Promise<RSSItem[]> {
    // Try corsproxy → rss2json
    try {
      return await this.fetchViaCorsproxy(url);
    } catch (e1) {
      console.warn('corsproxy failed, falling back to rss2json:', e1);
      try {
        return await this.fetchViaRss2json(url);
      } catch (error) {
        console.error('All proxies failed for feed:', url, error);
        throw new Error(`Failed to fetch RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  static parseRSS2JSONFeed(data: any): RSSItem[] {
    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      contentSnippet: item.description || '',
      summary: item.description || '',
      pubDate: item.pubDate || '',
      isoDate: item.pubDate || '',
      guid: item.guid || item.link || '',
      creator: item.author || '',
      categories: item.categories || [],
    }));
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
      }
    }

    // Sort by date, newest first — using normalized date parsing
    return allNews.sort((a, b) => {
      const dateA = this.parseDate(a.isoDate || a.pubDate || '');
      const dateB = this.parseDate(b.isoDate || b.pubDate || '');
      return dateB.getTime() - dateA.getTime();
    });
  }

  static truncateDescription(htmlText: string, maxLength: number): string {
    // Remove HTML tags to get plain text
    const plainText = htmlText.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return htmlText;

    // Truncate plain text
    const truncated = plainText.substring(0, maxLength).trim();

    // Find the corresponding position in HTML text
    let htmlPos = 0;
    let textPos = 0;
    const result = [];

    while (htmlPos < htmlText.length && textPos < truncated.length) {
      if (htmlText[htmlPos] === '<') {
        // Copy the entire tag
        const tagEnd = htmlText.indexOf('>', htmlPos);
        if (tagEnd === -1) break;
        result.push(htmlText.substring(htmlPos, tagEnd + 1));
        htmlPos = tagEnd + 1;
      } else {
        result.push(htmlText[htmlPos]);
        htmlPos++;
        textPos++;
      }
    }

    // Close any unclosed tags (simple approach)
    const openTags = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(result.join(''))) !== null) {
      const tag = match[0];
      const tagName = match[1];

      if (tag.startsWith('</')) {
        // Closing tag
        if (openTags.length > 0 && openTags[openTags.length - 1] === tagName) {
          openTags.pop();
        }
      } else if (!tag.endsWith('/>') && !['br', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
        // Opening tag (not self-closing)
        openTags.push(tagName);
      }
    }

    // Add closing tags for any remaining open tags
    while (openTags.length > 0) {
      const tagName = openTags.pop();
      result.push(`</${tagName}>`);
    }

    return result.join('') + '...';
  }

  static validateFeedUrl(url: string): boolean {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      new URL(normalizedUrl);
      return true;
    } catch {
      return false;
    }
  }

  static normalizeUrl(url: string): string {
    // If URL doesn't start with http:// or https://, add https://
    // Handles both full URLs and shorthand like "www.example.com" or "example.com"
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }
}
