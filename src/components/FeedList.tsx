import { useState } from 'react';
import { RSSService } from '../services';
import type { FeedListProps } from '../types/component-props';
import type { RSSFeed } from '../types';

export const FeedList = ({ feeds, onRemoveFeed, onMoveFeed, onMoveFeedToIndex, onEditFeed }: FeedListProps) => {
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

    if (!window.confirm('Confermi il salvataggio delle modifiche al feed?')) {
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
        <p>Nessun feed RSS aggiunto ancora.</p>
        <p className="text-sm mt-2">Usa il pulsante "Aggiungi Feed RSS" per iniziare.</p>
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
            className={`surface rounded-lg p-4 transition md:flex md:items-center md:justify-between ${draggedFeedId === feed.id ? 'opacity-60' : ''} ${dragOverFeedId === feed.id && draggedFeedId !== feed.id ? 'ring-2 ring-[color:var(--ring)]' : ''}`}
          >
            <div className="md:flex-1">
              {isEditing(feed.id) ? (
                <div className="space-y-2 pr-4">
                  <div>
                    <label htmlFor={`feed-title-${feed.id}`} className="block text-xs font-medium text-secondary mb-1">
                      Nome feed
                    </label>
                    <input
                      id={`feed-title-${feed.id}`}
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor={`feed-url-${feed.id}`} className="block text-xs font-medium text-secondary mb-1">
                      URL feed
                    </label>
                    <input
                      id={`feed-url-${feed.id}`}
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="input-field"
                    />
                    <p className={`text-xs mt-1 ${isUrlValid ? 'text-emerald-600' : 'text-[var(--danger)]'}`}>
                      {isUrlValid ? 'URL valido' : 'URL non valido'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-primary">{feed.title}</h3>
                  <p className="text-sm text-secondary truncate">{feed.url}</p>
                </>
              )}
              {feed.lastFetched && (
                <p className="text-xs text-muted">
                  Ultimo aggiornamento: {new Date(feed.lastFetched).toLocaleString('it-IT')}
                </p>
              )}
              {feed.error && (
                <p className="text-xs text-[var(--danger)]">Errore: {feed.error}</p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0 md:ml-4 md:flex-nowrap md:justify-end">
              {isEditing(feed.id) ? (
                <>
                  <button
                    onClick={() => saveEditing(feed.id)}
                    disabled={!editTitle.trim() || !isUrlValid || savingFeedId === feed.id}
                    className="btn-brand disabled:opacity-50 px-3 py-2 rounded-md text-sm font-medium"
                    title="Salva modifiche"
                  >
                    {savingFeedId === feed.id ? 'Salvataggio...' : 'Salva'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="btn-neutral px-3 py-2 rounded-md text-sm font-medium"
                    title="Annulla modifica"
                  >
                    Annulla
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="text-muted px-2 py-1 select-none cursor-grab"
                    title="Trascina per riordinare (desktop e touch)"
                    aria-label="Trascina per riordinare"
                  >
                    ⋮⋮
                  </span>
                  <button
                    onClick={() => onMoveFeed(feed.id, 'up')}
                    disabled={index === 0}
                    className="btn-neutral disabled:opacity-40 px-2 py-1 rounded-md"
                    title="Sposta su"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => onMoveFeed(feed.id, 'down')}
                    disabled={index === feeds.length - 1}
                    className="btn-neutral disabled:opacity-40 px-2 py-1 rounded-md"
                    title="Sposta giu"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => startEditing(feed)}
                    className="btn-neutral px-2 py-1 rounded-md"
                    title="Modifica feed"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onRemoveFeed(feed.id)}
                    className="text-[var(--danger)] hover:opacity-80 p-2 rounded-full hover:bg-[color:var(--surface-muted)] transition-colors"
                    title="Rimuovi feed"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};