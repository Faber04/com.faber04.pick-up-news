import { useState } from 'react';
import { AddFeedForm, FeedList } from '../components';
import type { FeedsPageProps } from '../types/page-props';
import { Button } from '../components/ui';

export const FeedsPage = ({
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
}: FeedsPageProps) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app-container py-8 stagger-in">
      <h2 className="text-2xl font-bold text-primary mb-6">Gestione Feed RSS</h2>
      
      {/* Buttons header - aligned horizontally */}
      <div className="flex gap-3 mb-6">
        <Button
          type="button"
          onClick={() => setShowForm(!showForm)}
          variant="brand"
        >
          + Aggiungi Feed RSS
        </Button>
        {feeds.length > 0 && (
          <Button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            variant="secondary"
          >
            {loading ? 'Aggiornando...' : '🔄 Aggiorna'}
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
