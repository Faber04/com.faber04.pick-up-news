import { useState } from 'react';
import { AddFeedForm, FeedList } from './index';
import { RSSFeed } from '../types';

interface FeedsContentProps {
  feeds: RSSFeed[];
  loading: boolean;
  addFeedError: string | null;
  onAddFeed: (url: string, title: string) => Promise<boolean>;
  onClearError: () => void;
  onRemoveFeed: (feedId: string) => void;
  onMoveFeed: (feedId: string, direction: 'up' | 'down') => void;
  onMoveFeedToIndex: (feedId: string, targetIndex: number) => void;
  onEditFeed: (feedId: string, updates: { title: string; url: string }) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

export const FeedsContent = ({
  feeds,
  loading,
  addFeedError,
  onAddFeed,
  onClearError,
  onRemoveFeed,
  onMoveFeed,
  onMoveFeedToIndex,
  onEditFeed,
  onRefresh,
}: FeedsContentProps) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {/* Buttons header - aligned horizontally */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brand w-full rounded-lg px-4 py-3 font-medium transition sm:w-auto"
        >
          + Aggiungi Feed RSS
        </button>
        {feeds.length > 0 && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-success w-full rounded-lg px-4 py-3 font-medium text-white transition disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Aggiornando...' : '🔄 Aggiorna'}
          </button>
        )}
      </div>

      {/* Conditional form */}
      {showForm && (
        <AddFeedForm
          onAddFeed={onAddFeed}
          loading={loading}
          error={addFeedError}
          onClearError={onClearError}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Feed list */}
      <FeedList
        feeds={feeds}
        onRemoveFeed={onRemoveFeed}
        onMoveFeed={onMoveFeed}
        onMoveFeedToIndex={onMoveFeedToIndex}
        onEditFeed={onEditFeed}
      />
    </div>
  );
};
