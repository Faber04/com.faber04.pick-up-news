import { useEffect, useMemo, useState } from 'react';
import { NewsItem, ViewMode } from '../types';

const ACCORDION_STORAGE_KEY = 'pickUpNews_byFeed_openAccordions';

interface NewsListProps {
  news: NewsItem[];
  viewMode: ViewMode;
  feedOrder: string[];
  loading: boolean;
  onNewsClick: (newsItem: NewsItem) => void;
}

export const NewsList = ({ news, viewMode, feedOrder, loading, onNewsClick }: NewsListProps) => {
  const [openFeedIds, setOpenFeedIds] = useState<Set<string>>(() => {
    try {
      const rawValue = localStorage.getItem(ACCORDION_STORAGE_KEY);
      if (!rawValue) {
        return new Set<string>();
      }

      const parsed = JSON.parse(rawValue);
      if (!Array.isArray(parsed)) {
        return new Set<string>();
      }

      return new Set<string>(parsed.filter((value) => typeof value === 'string'));
    } catch {
      return new Set<string>();
    }
  });

  const groupedNews = useMemo(() => {
    if (viewMode !== 'by-feed') {
      return null;
    }

    return news.reduce((acc, item) => {
      if (!acc[item.feedId]) {
        acc[item.feedId] = {
          feedTitle: item.feedTitle,
          items: []
        };
      }

      acc[item.feedId].items.push(item);
      return acc;
    }, {} as Record<string, { feedTitle: string; items: NewsItem[] }>);
  }, [news, viewMode]);

  const orderedGroups = useMemo(() => {
    if (!groupedNews) {
      return [] as [string, { feedTitle: string; items: NewsItem[] }][];
    }

    return Object.entries(groupedNews).sort(([feedIdA], [feedIdB]) => {
      const indexA = feedOrder.indexOf(feedIdA);
      const indexB = feedOrder.indexOf(feedIdB);
      const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      return safeIndexA - safeIndexB;
    });
  }, [feedOrder, groupedNews]);

  useEffect(() => {
    try {
      localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(Array.from(openFeedIds)));
    } catch {
      // Ignore persistence errors to avoid impacting rendering.
    }
  }, [openFeedIds]);

  useEffect(() => {
    if (orderedGroups.length === 0) {
      return;
    }

    const validFeedIds = new Set(orderedGroups.map(([feedId]) => feedId));

    setOpenFeedIds((prev) => {
      const filtered = new Set(Array.from(prev).filter((feedId) => validFeedIds.has(feedId)));

      if (filtered.size === prev.size) {
        return prev;
      }

      return filtered;
    });
  }, [orderedGroups]);

  const handleToggleAccordion = (feedId: string) => {
    setOpenFeedIds((prev) => {
      const next = new Set(prev);
      if (next.has(feedId)) {
        next.delete(feedId);
      } else {
        next.add(feedId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenFeedIds(new Set(orderedGroups.map(([feedId]) => feedId)));
  };

  const handleCollapseAll = () => {
    setOpenFeedIds(new Set<string>());
  };

  const openCount = orderedGroups.reduce((count, [feedId]) => {
    return openFeedIds.has(feedId) ? count + 1 : count;
  }, 0);
  const totalCount = orderedGroups.length;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--brand)]"></div>
        <p className="mt-2 text-secondary">Caricamento news...</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-muted surface rounded-xl">
        <p>Nessuna news disponibile.</p>
        <p className="text-sm mt-2">Aggiungi dei feed RSS e aggiorna per vedere le news.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === 'chronological' ? (
        <div className="space-y-4">
          {news.map((item, index) => (
            <NewsCard key={`${item.feedId}-${index}`} newsItem={item} onClick={onNewsClick} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="btn-neutral rounded-lg px-3 py-2 text-xs font-semibold"
            >
              Espandi tutti
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="btn-neutral rounded-lg px-3 py-2 text-xs font-semibold"
            >
              Comprimi tutti
            </button>
            <span className="ml-auto text-xs text-muted">
              {openCount} aperti su {totalCount}
            </span>
          </div>

          {orderedGroups.map(([feedId, group]) => (
            <FeedAccordion
              key={feedId}
              feedId={feedId}
              feedTitle={group.feedTitle}
              feedNews={group.items}
              isOpen={openFeedIds.has(feedId)}
              onToggle={handleToggleAccordion}
              onNewsClick={onNewsClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FeedAccordionProps {
  feedId: string;
  feedTitle: string;
  feedNews: NewsItem[];
  isOpen: boolean;
  onToggle: (feedId: string) => void;
  onNewsClick: (newsItem: NewsItem) => void;
}

const FeedAccordion = ({ feedId, feedTitle, feedNews, isOpen, onToggle, onNewsClick }: FeedAccordionProps) => {
  return (
    <div className="surface rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => onToggle(feedId)}
        className="w-full flex items-center justify-between px-4 py-3 surface-muted hover:brightness-95 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">{feedTitle}</span>
          <span className="text-xs badge-brand font-medium px-2 py-0.5 rounded-full">
            {feedNews.length}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="divide-y divide-[color:var(--border)]">
          {feedNews.map((item, index) => (
            <NewsCard key={`${item.feedId}-${index}`} newsItem={item} onClick={onNewsClick} showFeedTitle={false} />
          ))}
        </div>
      )}
    </div>
  );
};

interface NewsCardProps {
  newsItem: NewsItem;
  onClick: (newsItem: NewsItem) => void;
  showFeedTitle?: boolean;
}

const NewsCard = ({ newsItem, onClick, showFeedTitle = true }: NewsCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="news-card p-4 cursor-pointer"
      onClick={() => onClick(newsItem)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-primary line-clamp-2 flex-1 mr-4">
          {newsItem.title}
        </h4>
        <span className="text-xs text-muted whitespace-nowrap">
          {formatDate(newsItem.isoDate || newsItem.pubDate)}
        </span>
      </div>

      <div
        className="text-sm text-secondary mb-2 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: newsItem.truncatedDescription }}
      />

      <div className="flex justify-between items-center">
        {showFeedTitle && (
          <span className="text-xs text-[color:var(--brand)] font-medium">
            {newsItem.feedTitle}
          </span>
        )}
        <span className="text-xs text-muted ml-auto">
          →
        </span>
      </div>
    </div>
  );
};