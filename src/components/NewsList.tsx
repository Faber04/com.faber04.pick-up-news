import { useEffect, useMemo, useState } from 'react';
import { NewsItem } from '../types';
import type { FeedAccordionProps, NewsCardProps, NewsListProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';
import { Badge, Button, Card, CardContent } from './ui';

const ACCORDION_STORAGE_KEY = 'pickUpNews_byFeed_openAccordions';

export const NewsList = ({ news, viewMode, feedOrder, loading, onNewsClick }: NewsListProps) => {
  const { messages, locale, formatMessage } = useI18n();
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
        <p className="mt-2 text-secondary">{messages.home.loadingNews}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted">
          <p>{messages.home.noNewsTitle}</p>
          <p className="mt-2 text-sm">{messages.home.noNewsDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === 'chronological' ? (
        <div className="space-y-4">
          {news.map((item, index) => (
            <NewsCard key={`${item.feedId}-${index}`} newsItem={item} onClick={onNewsClick} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleExpandAll}
              variant="outline"
              size="sm"
            >
                {messages.home.expandAll}
            </Button>
            <Button
              onClick={handleCollapseAll}
              variant="outline"
              size="sm"
            >
                {messages.home.collapseAll}
            </Button>
            <span className="ml-auto text-xs text-muted">
                {formatMessage(messages.home.openCount, { openCount, totalCount })}
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
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FeedAccordion = ({ feedId, feedTitle, feedNews, isOpen, onToggle, onNewsClick, locale }: FeedAccordionProps) => {
  return (
    <Card className="overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => onToggle(feedId)}
        className="flex w-full items-center justify-between bg-[color:var(--surface-muted)] px-4 py-3 text-left transition-colors hover:brightness-95"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">{feedTitle}</span>
          <Badge variant="brand" className="text-xs">
            {feedNews.length}
          </Badge>
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
            <NewsCard key={`${item.feedId}-${index}`} newsItem={item} onClick={onNewsClick} showFeedTitle={false} locale={locale} />
          ))}
        </div>
      )}
    </Card>
  );
};

const NewsCard = ({ newsItem, onClick, showFeedTitle = true, locale }: NewsCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(locale, {
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
    <Card
      className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
      onClick={() => onClick(newsItem)}
    >
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="mr-4 line-clamp-2 flex-1 font-medium text-primary">
            {newsItem.title}
          </h4>
          <span className="whitespace-nowrap text-xs text-muted">
            {formatDate(newsItem.isoDate || newsItem.pubDate)}
          </span>
        </div>

        <div
          className="mb-2 line-clamp-2 text-sm text-secondary"
          dangerouslySetInnerHTML={{ __html: newsItem.truncatedDescription }}
        />

        <div className="flex items-center justify-between">
          {showFeedTitle && (
            <span className="text-xs font-medium text-[color:var(--brand)]">
              {newsItem.feedTitle}
            </span>
          )}
          <span className="ml-auto text-xs text-muted">
            →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};