import type { NewsDetailModalProps } from '../types/component-props';

export const NewsDetailModal = ({ newsItem, isOpen, onClose }: NewsDetailModalProps) => {
  if (!isOpen || !newsItem) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} (${hours}:${minutes})`;
    } catch {
      return '';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="surface-strong max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] p-4 sm:items-center sm:p-6">
          <h2 className="line-clamp-3 text-xl font-bold text-primary sm:text-2xl">
            {newsItem.title}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-muted hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[calc(90vh-104px)] overflow-y-auto p-4 sm:max-h-[calc(90vh-120px)] sm:p-6">
          <div className="mb-4 flex flex-wrap items-start gap-2 text-sm text-secondary sm:gap-4">
            <span className="badge-brand rounded-full px-2 py-1">
              {newsItem.feedTitle}
            </span>
            <span className="min-w-0 break-words">
              {formatDate(newsItem.isoDate || newsItem.pubDate)}
            </span>
            {newsItem.creator && (
              <span className="min-w-0 break-words">di {newsItem.creator}</span>
            )}
          </div>

          {newsItem.content ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
          ) : newsItem.contentSnippet ? (
            <div
              className="prose prose-sm max-w-none text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsItem.contentSnippet }}
            />
          ) : newsItem.summary ? (
            <div
              className="prose prose-sm max-w-none text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsItem.summary }}
            />
          ) : (
            <p className="text-muted italic">Nessun contenuto disponibile</p>
          )}

          {newsItem.link && (
            <div className="mt-6 pt-4 border-t border-[color:var(--border)]">
              <a
                href={newsItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-brand px-4 py-2 rounded-lg font-medium transition"
              >
                Leggi l'articolo completo →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};