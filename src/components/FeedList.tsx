import { useState } from 'react';
import { RSSFeed } from '../types';
import { RSSService } from '../services';

interface FeedListProps {
  feeds: RSSFeed[];
  onRemoveFeed: (feedId: string) => void;
  onMoveFeed: (feedId: string, direction: 'up' | 'down') => void;
  onEditFeed: (feedId: string, updates: { title: string; url: string }) => boolean;
}

export const FeedList = ({ feeds, onRemoveFeed, onMoveFeed, onEditFeed }: FeedListProps) => {
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

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

  const saveEditing = (feedId: string) => {
    const title = editTitle.trim();
    const url = editUrl.trim();
    if (!title || !url || !RSSService.validateFeedUrl(url)) {
      return;
    }

    if (!window.confirm('Confermi il salvataggio delle modifiche al feed?')) {
      return;
    }

    const updated = onEditFeed(feedId, { title, url });
    if (updated) {
      cancelEditing();
    }
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
            className="flex items-center justify-between surface rounded-lg p-4"
          >
            <div className="flex-1">
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
            <div className="ml-4 flex items-center gap-1">
              {isEditing(feed.id) ? (
                <>
                  <button
                    onClick={() => saveEditing(feed.id)}
                    disabled={!editTitle.trim() || !isUrlValid}
                    className="btn-brand disabled:opacity-50 px-3 py-2 rounded-md text-sm font-medium"
                    title="Salva modifiche"
                  >
                    Salva
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