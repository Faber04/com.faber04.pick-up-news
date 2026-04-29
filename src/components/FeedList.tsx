import { useState } from 'react';
import { RSSService } from '../services';
import type { FeedListProps } from '../types/component-props';
import type { RSSFeed } from '../types';
import { useI18n } from '../i18n/useI18n';
import { Button, Card, CardContent, Input } from './ui';

export const FeedList = ({ feeds, onRemoveFeed, onMoveFeed, onMoveFeedToIndex, onEditFeed }: FeedListProps) => {
  const { messages, locale, formatMessage } = useI18n();
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [draggedFeedId, setDraggedFeedId] = useState<string | null>(null);
  const [dragOverFeedId, setDragOverFeedId] = useState<string | null>(null);
  const [savingFeedId, setSavingFeedId] = useState<string | null>(null);

  const isEditing = (feedId: string) => editingFeedId === feedId;
  const isUrlValid = editUrl.trim().length > 0 && RSSService.validateFeedUrl(editUrl.trim());

  const startEditing = (feed: RSSFeed) => {
    setEditingFeedId(feed.id);
    setEditTitle(feed.title);
    setEditUrl(feed.url);
  };

  const cancelEditing = () => {
    setEditingFeedId(null);
    setEditTitle('');
    setEditUrl('');
  };

  const saveEditing = async (feedId: string) => {
    const title = editTitle.trim();
    const url = editUrl.trim();
    if (!title || !url || !RSSService.validateFeedUrl(url)) {
      return;
    }

    if (!window.confirm(messages.feeds.saveConfirm)) {
      return;
    }

    setSavingFeedId(feedId);
    const updated = await onEditFeed(feedId, { title, url });
    setSavingFeedId(null);

    if (updated) {
      cancelEditing();
    }
  };

  const handleDragStart = (feedId: string) => {
    if (editingFeedId) return;
    setDraggedFeedId(feedId);
    setDragOverFeedId(feedId);
  };

  const handleDragEnd = () => {
    setDraggedFeedId(null);
    setDragOverFeedId(null);
  };

  const handleDrop = (targetFeedId: string) => {
    if (!draggedFeedId || draggedFeedId === targetFeedId) {
      setDraggedFeedId(null);
      setDragOverFeedId(null);
      return;
    }

    const targetIndex = feeds.findIndex(feed => feed.id === targetFeedId);
    if (targetIndex !== -1) {
      onMoveFeedToIndex(draggedFeedId, targetIndex);
    }

    setDraggedFeedId(null);
    setDragOverFeedId(null);
  };

  const handleTouchStart = (feedId: string) => {
    if (editingFeedId) return;
    setDraggedFeedId(feedId);
    setDragOverFeedId(feedId);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!draggedFeedId) {
      return;
    }

    const touch = event.touches[0];
    const hoveredElement = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    const hoveredRow = hoveredElement?.closest('[data-feed-row-id]') as HTMLElement | null;
    const hoveredFeedId = hoveredRow?.dataset.feedRowId;

    if (hoveredFeedId) {
      setDragOverFeedId(hoveredFeedId);
    }
  };

  const handleTouchEnd = () => {
    if (!draggedFeedId || !dragOverFeedId || draggedFeedId === dragOverFeedId) {
      setDraggedFeedId(null);
      setDragOverFeedId(null);
      return;
    }

    const targetIndex = feeds.findIndex(feed => feed.id === dragOverFeedId);
    if (targetIndex !== -1) {
      onMoveFeedToIndex(draggedFeedId, targetIndex);
    }

    setDraggedFeedId(null);
    setDragOverFeedId(null);
  };

  if (feeds.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <p>{messages.feeds.emptyTitle}</p>
        <p className="text-sm mt-2">{messages.feeds.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="space-y-2">
        {feeds.map((feed, index) => (
          <div
            key={feed.id}
            data-feed-row-id={feed.id}
            draggable={!editingFeedId}
            onDragStart={() => handleDragStart(feed.id)}
            onDragEnd={handleDragEnd}
            onDragEnter={() => draggedFeedId && setDragOverFeedId(feed.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(feed.id)}
            onTouchStart={() => handleTouchStart(feed.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${draggedFeedId === feed.id ? 'opacity-60' : ''}`}
          >
            <Card className={`transition md:flex md:items-center md:justify-between ${dragOverFeedId === feed.id && draggedFeedId !== feed.id ? 'ring-2 ring-[color:var(--ring)]' : ''}`}>
              <CardContent className="p-4 md:flex md:w-full md:items-center md:justify-between">
                <div className="md:flex-1">
                  {isEditing(feed.id) ? (
                    <div className="space-y-3 pr-4">
                      <div>
                        <label htmlFor={`feed-title-${feed.id}`} className="mb-1 block text-xs font-medium text-secondary">
                          {messages.feeds.feedNameShort}
                        </label>
                        <Input
                          id={`feed-title-${feed.id}`}
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor={`feed-url-${feed.id}`} className="mb-1 block text-xs font-medium text-secondary">
                          {messages.feeds.feedUrlShort}
                        </label>
                        <Input
                          id={`feed-url-${feed.id}`}
                          type="text"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className={!isUrlValid && editUrl.trim() ? 'border-[color:var(--danger)] focus-visible:ring-[color:var(--danger)]' : ''}
                        />
                        <p className={`mt-1 text-xs ${isUrlValid ? 'text-emerald-600' : 'text-[var(--danger)]'}`}>
                          {isUrlValid ? messages.feeds.validUrl : messages.feeds.invalidUrl}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-primary">{feed.title}</h3>
                      <p className="truncate text-sm text-secondary">{feed.url}</p>
                    </>
                  )}
                  {feed.lastFetched && (
                    <p className="text-xs text-muted">
                      {formatMessage(messages.feeds.lastUpdated, { date: new Date(feed.lastFetched).toLocaleString(locale) })}
                    </p>
                  )}
                  {feed.error && (
                    <p className="text-xs text-[var(--danger)]">{formatMessage(messages.feeds.errorLabel, { error: feed.error })}</p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0 md:ml-4 md:flex-nowrap md:justify-end">
                  {isEditing(feed.id) ? (
                    <>
                      <Button
                        type="button"
                        onClick={() => saveEditing(feed.id)}
                        disabled={!editTitle.trim() || !isUrlValid || savingFeedId === feed.id}
                        variant="brand"
                        size="sm"
                        title={messages.feeds.saveTitle}
                      >
                        {savingFeedId === feed.id ? messages.feeds.saving : messages.feeds.save}
                      </Button>
                      <Button
                        type="button"
                        onClick={cancelEditing}
                        variant="secondary"
                        size="sm"
                        title={messages.feeds.cancelEditTitle}
                      >
                        {messages.feeds.cancel}
                      </Button>
                    </>
                  ) : (
                    <>
                      <span
                        className="select-none px-2 py-1 text-muted cursor-grab"
                        title={messages.feeds.dragReorderHint}
                        aria-label={messages.feeds.dragReorder}
                      >
                        ⋮⋮
                      </span>
                      <Button
                        type="button"
                        onClick={() => onMoveFeed(feed.id, 'up')}
                        disabled={index === 0}
                        variant="secondary"
                        size="sm"
                        className="px-2"
                        title={messages.feeds.moveUp}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onMoveFeed(feed.id, 'down')}
                        disabled={index === feeds.length - 1}
                        variant="secondary"
                        size="sm"
                        className="px-2"
                        title={messages.feeds.moveDown}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        onClick={() => startEditing(feed)}
                        variant="secondary"
                        size="sm"
                        className="px-2"
                        title={messages.feeds.editFeed}
                      >
                        ✏️
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onRemoveFeed(feed.id)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[color:var(--danger)] hover:bg-[color:color-mix(in_srgb,var(--danger)_12%,var(--surface-muted)_88%)] hover:text-[color:var(--danger)]"
                        title={messages.feeds.removeFeed}
                      >
                        🗑️
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};