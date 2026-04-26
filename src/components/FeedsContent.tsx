import { useState } from 'react';
import { AddFeedForm, FeedList } from './index';
import type { FeedsContentProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';

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
  const { messages } = useI18n();

  return (
    <div>
      {/* Buttons header - aligned horizontally */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brand w-full rounded-lg px-4 py-3 font-medium transition sm:w-auto"
        >
          {messages.feeds.addFeedToggle}
        </button>
        {feeds.length > 0 && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-success w-full rounded-lg px-4 py-3 font-medium text-white transition disabled:opacity-60 sm:w-auto"
          >
            {loading ? messages.feeds.refreshing : messages.feeds.refresh}
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
