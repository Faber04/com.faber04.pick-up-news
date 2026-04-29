import { useState } from 'react';
import { AddFeedForm, FeedList } from './index';
import type { FeedsContentProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';
import { Button } from './ui';

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
        <Button
          type="button"
          onClick={() => setShowForm(!showForm)}
          variant="brand"
          size="xl"
          className="w-full sm:w-auto"
        >
          {messages.feeds.addFeedToggle}
        </Button>
        {feeds.length > 0 && (
          <Button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            variant="secondary"
            size="xl"
            className="w-full sm:w-auto"
          >
            {loading ? messages.feeds.refreshing : messages.feeds.refresh}
          </Button>
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
