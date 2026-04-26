import { useState, useEffect, useCallback, useRef } from 'react';
import { RSSFeed, AppState, ViewMode, FilterOptions, ThemeMode } from '../types';
import { RSSService } from '../services';

const STORAGE_KEYS = {
  FEEDS: 'pickUpNews_feeds',
  VIEW_MODE: 'pickUpNews_viewMode',
  THEME: 'pickUpNews_theme'
};

export const useAppState = () => {
  const pendingAddUrlsRef = useRef<Set<string>>(new Set());

  const [state, setState] = useState<AppState>({
    feeds: [],
    news: [],
    loading: false,
    error: null
  });

  const [viewMode, setViewMode] = useState<ViewMode>('chronological');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFeeds = localStorage.getItem(STORAGE_KEYS.FEEDS);
    const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    const savedThemeMode = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;

    if (savedFeeds) {
      try {
        const feeds = JSON.parse(savedFeeds);
        setState(prev => ({ ...prev, feeds }));
      } catch (error) {
        console.error('Error loading feeds from localStorage:', error);
      }
    }

    if (savedViewMode) {
      setViewMode(savedViewMode as ViewMode);
    }

    if (savedThemeMode === 'light' || savedThemeMode === 'dark') {
      setThemeMode(savedThemeMode);
      return;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDark ? 'dark' : 'light');
  }, []);

  // Save feeds to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDS, JSON.stringify(state.feeds));
  }, [state.feeds]);

  // Save view mode to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const addFeed = useCallback(async (url: string, title: string): Promise<boolean> => {
    if (!RSSService.validateFeedUrl(url)) {
      setState(prev => ({ ...prev, error: 'Invalid RSS feed URL' }));
      return false;
    }

    const normalizedUrl = RSSService.normalizeUrl(url);
    const normalizedKey = normalizedUrl.toLowerCase();

    if (pendingAddUrlsRef.current.has(normalizedKey)) {
      return false;
    }

    pendingAddUrlsRef.current.add(normalizedKey);
    setState(prev => ({ ...prev, loading: true, error: null }));

    let finalFeedUrl = normalizedUrl;
    let finalKey = normalizedKey;
    let detectedFeedUrl: string | null = null;

    try {
      // Try automatic detection first (JSON Feed -> RSS/Atom), then keep manual URL as fallback.
      try {
        const detected = await RSSService.detectFeedUrl(normalizedUrl);
        if (detected?.feedUrl) {
          finalFeedUrl = detected.feedUrl;
          finalKey = detected.feedUrl.toLowerCase();
          detectedFeedUrl = detected.feedUrl;
        }
      } catch {
        // Keep manual URL if detection fails.
      }

      // If detection fails, validate that the user-provided URL is actually a feed.
      if (!detectedFeedUrl) {
        try {
          await RSSService.fetchFeed(normalizedUrl);
        } catch {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Feed non rilevato automaticamente. Inserisci un URL feed RSS/Atom/JSON valido.'
          }));
          return false;
        }
      }

      const newFeed: RSSFeed = {
        id: Date.now().toString(),
        url: finalFeedUrl,
        title,
        lastFetched: new Date()
      };

      const alreadyExists = state.feeds.some(feed => feed.url.toLowerCase() === finalKey);
      if (alreadyExists) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Feed già presente'
        }));
        return false;
      }

      setState(prev => {
        return {
          ...prev,
          feeds: [...prev.feeds, newFeed],
          loading: false,
          error: null
        };
      });

      return true;
    } finally {
      pendingAddUrlsRef.current.delete(normalizedKey);
      pendingAddUrlsRef.current.delete(finalKey);
    }
  }, [state.feeds]);

  const removeFeed = useCallback((feedId: string) => {
    setState(prev => ({
      ...prev,
      feeds: prev.feeds.filter(feed => feed.id !== feedId),
      news: prev.news.filter(news => news.feedId !== feedId)
    }));
  }, []);

  const moveFeed = useCallback((feedId: string, direction: 'up' | 'down') => {
    setState(prev => {
      const currentIndex = prev.feeds.findIndex(feed => feed.id === feedId);
      if (currentIndex === -1) {
        return prev;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.feeds.length) {
        return prev;
      }

      const reorderedFeeds = [...prev.feeds];
      const [movedFeed] = reorderedFeeds.splice(currentIndex, 1);
      reorderedFeeds.splice(targetIndex, 0, movedFeed);

      return {
        ...prev,
        feeds: reorderedFeeds
      };
    });
  }, []);

  const moveFeedToIndex = useCallback((feedId: string, targetIndex: number) => {
    setState(prev => {
      const currentIndex = prev.feeds.findIndex(feed => feed.id === feedId);
      if (currentIndex === -1 || targetIndex < 0 || targetIndex >= prev.feeds.length || currentIndex === targetIndex) {
        return prev;
      }

      const reorderedFeeds = [...prev.feeds];
      const [movedFeed] = reorderedFeeds.splice(currentIndex, 1);
      reorderedFeeds.splice(targetIndex, 0, movedFeed);

      return {
        ...prev,
        feeds: reorderedFeeds
      };
    });
  }, []);

  const updateFeed = useCallback(async (feedId: string, updates: { title: string; url: string }) => {
    if (!RSSService.validateFeedUrl(updates.url)) {
      setState(prev => ({ ...prev, error: 'Invalid RSS feed URL' }));
      return false;
    }

    const updatedTitle = updates.title.trim();
    const normalizedUrl = RSSService.normalizeUrl(updates.url);
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const fetchedItems = await RSSService.fetchFeed(normalizedUrl);
      const now = new Date();

      const refreshedFeedNews = fetchedItems.map(item => ({
        ...item,
        feedId,
        feedTitle: updatedTitle,
        truncatedDescription: RSSService.truncateDescription(item.contentSnippet || item.summary || '', 120)
      }));

      setState(prev => {
        const newsWithoutCurrentFeed = prev.news.filter(news => news.feedId !== feedId);
        const mergedNews = [...newsWithoutCurrentFeed, ...refreshedFeedNews].sort((a, b) => {
          const dateA = new Date(a.isoDate || a.pubDate || '').getTime();
          const dateB = new Date(b.isoDate || b.pubDate || '').getTime();
          return dateB - dateA;
        });

        return {
          ...prev,
          feeds: prev.feeds.map(feed => {
            if (feed.id !== feedId) {
              return feed;
            }

            return {
              ...feed,
              title: updatedTitle,
              url: normalizedUrl,
              lastFetched: now,
              error: undefined
            };
          }),
          news: mergedNews,
          loading: false,
          error: null
        };
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh feed after update';

      setState(prev => ({
        ...prev,
        feeds: prev.feeds.map(feed => {
          if (feed.id !== feedId) {
            return feed;
          }

          return {
            ...feed,
            title: updatedTitle,
            url: normalizedUrl,
            error: errorMessage
          };
        }),
        loading: false,
        error: errorMessage
      }));

      return false;
    }
  }, []);

  const refreshNews = useCallback(async () => {
    if (state.feeds.length === 0) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const news = await RSSService.fetchAllFeeds(state.feeds);
      setState(prev => ({ ...prev, news, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch news'
      }));
    }
  }, [state.feeds]);

  const getFilteredNews = useCallback(() => {
    let filtered = state.news;

    if (filterOptions.feedId) {
      filtered = filtered.filter(news => news.feedId === filterOptions.feedId);
    }

    if (filterOptions.searchTerm) {
      const term = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(news =>
        news.title?.toLowerCase().includes(term) ||
        news.truncatedDescription.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [state.news, filterOptions]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return {
    state,
    viewMode,
    setViewMode,
    themeMode,
    setThemeMode,
    toggleTheme,
    filterOptions,
    setFilterOptions,
    addFeed,
    removeFeed,
    moveFeed,
    moveFeedToIndex,
    updateFeed,
    refreshNews,
    getFilteredNews,
    clearError
  };
};