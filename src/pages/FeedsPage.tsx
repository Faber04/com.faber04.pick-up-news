import { useState } from 'react';
import { AddFeedForm, FeedList } from '../components';
import type { FeedsPageProps } from '../types/page-props';

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
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brand px-4 py-2 rounded-lg font-medium transition"
        >
          + Aggiungi Feed RSS
        </button>
        {feeds.length > 0 && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-success disabled:opacity-60 text-white px-4 py-2 rounded-lg font-medium transition"
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
