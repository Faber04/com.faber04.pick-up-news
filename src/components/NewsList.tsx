import { useEffect, useMemo, useState } from 'react';
import { NewsItem } from '../types';
import type { NewsCardProps, NewsListProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, Card, CardContent } from './ui';

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

          <Accordion
            type="multiple"
            value={Array.from(openFeedIds)}
            onValueChange={(values) => setOpenFeedIds(new Set(values))}
            className="space-y-3"
          >
            {orderedGroups.map(([feedId, group]) => (
              <AccordionItem key={feedId} value={feedId}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{group.feedTitle}</span>
                    <Badge variant="brand" className="text-xs">
                      {group.items.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2.5">
                    {group.items.map((item, index) => (
                      <NewsCard
                        key={`${item.feedId}-${index}`}
                        newsItem={item}
                        onClick={onNewsClick}
                        showFeedTitle={false}
                        locale={locale}
                        compact
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};
const NewsCard = ({ newsItem, onClick, showFeedTitle = true, locale, compact = false }: NewsCardProps) => {
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
      className={`cursor-pointer transition-transform duration-200 ${compact ? 'rounded-lg hover:-translate-y-0 shadow-[0_10px_24px_-20px_rgba(2,8,23,0.8)]' : 'hover:-translate-y-0.5'}`}
      onClick={() => onClick(newsItem)}
    >
      <CardContent className={compact ? 'p-3 pt-2.5' : 'p-4'}>
        <div className={`flex items-start justify-between ${compact ? 'mb-1.5' : 'mb-2'}`}>
          <h4 className={`mr-4 line-clamp-2 flex-1 font-medium text-primary ${compact ? 'text-[0.92rem] leading-snug' : ''}`}>
            {newsItem.title}
          </h4>
          <span className="whitespace-nowrap text-xs text-muted">
            {formatDate(newsItem.isoDate || newsItem.pubDate)}
          </span>
        </div>

        <div
          className={`line-clamp-2 text-secondary ${compact ? 'mb-1.5 text-[0.82rem] leading-snug' : 'mb-2 text-sm'}`}
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