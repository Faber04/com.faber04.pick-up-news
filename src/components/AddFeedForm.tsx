import { useState } from 'react';

interface AddFeedFormProps {
  onAddFeed: (url: string, title: string) => Promise<boolean>;
  loading: boolean;
  error?: string | null;
  onClearError?: () => void;
  onClose?: () => void;
}

export const AddFeedForm = ({ onAddFeed, loading, error, onClearError, onClose }: AddFeedFormProps) => {
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
        <h3 className="text-lg font-semibold text-primary">Aggiungi Feed RSS</h3>
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
            Nome del Feed
          </label>
          <input
            id="feed-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Corriere della Sera"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="feed-url" className="block text-sm font-medium text-secondary mb-1">
            URL Sito o Feed
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
            placeholder="es. example.com oppure example.com/rss"
            className={`input-field ${error ? 'border-[var(--danger)] focus:border-[var(--danger)]' : ''}`}
            required
          />
          {error && (
            <p className="text-xs text-[var(--danger)] mt-1">{error}</p>
          )}
          <p className="text-xs text-muted mt-1">
            Rilevamento automatico: prima JSON Feed, poi RSS/Atom. Se non trovato, usa l'URL inserito.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="btn-brand disabled:opacity-60 px-4 py-2 rounded-md font-medium transition"
          >
            {loading || isSubmitting ? 'Aggiungendo...' : 'Aggiungi Feed'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-neutral px-4 py-2 rounded-md font-medium transition"
            >
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  );
};