import { useState } from 'react';
import type { AddFeedFormProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';

export const AddFeedForm = ({ onAddFeed, loading, error, onClearError, onClose }: AddFeedFormProps) => {
  const { messages } = useI18n();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim() || loading || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const added = await onAddFeed(url.trim(), title.trim());
      if (added) {
        setUrl('');
        setTitle('');
        onClose?.();
      }
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="surface rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary">{messages.feeds.addFeedTitle}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted hover:text-primary"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feed-title" className="block text-sm font-medium text-secondary mb-1">
            {messages.feeds.feedName}
          </label>
          <input
            id="feed-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={messages.feeds.feedNamePlaceholder}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="feed-url" className="block text-sm font-medium text-secondary mb-1">
            {messages.feeds.feedUrl}
          </label>
          <input
            id="feed-url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) {
                onClearError?.();
              }
            }}
            placeholder={messages.feeds.feedUrlPlaceholder}
            className={`input-field ${error ? 'border-[var(--danger)] focus:border-[var(--danger)]' : ''}`}
            required
          />
          {error && (
            <p className="text-xs text-[var(--danger)] mt-1">{error}</p>
          )}
          <p className="text-xs text-muted mt-1">
            {messages.feeds.detectionHint}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="btn-feeds-action disabled:opacity-60 px-4 py-2 rounded-md font-medium transition"
          >
            {loading || isSubmitting ? messages.feeds.addFeedSubmitting : messages.feeds.addFeedButton}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-feeds-action-secondary px-4 py-2 rounded-md font-medium transition"
            >
              {messages.feeds.cancel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};