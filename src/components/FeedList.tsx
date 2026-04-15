import { RSSFeed } from '../types';

interface FeedListProps {
  feeds: RSSFeed[];
  onRemoveFeed: (feedId: string) => void;
}

export const FeedList = ({ feeds, onRemoveFeed }: FeedListProps) => {
  if (feeds.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nessun feed RSS aggiunto ancora.</p>
        <p className="text-sm mt-2">Usa il pulsante "Aggiungi Feed RSS" per iniziare.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="space-y-2">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{feed.title}</h3>
              <p className="text-sm text-gray-600 truncate">{feed.url}</p>
              {feed.lastFetched && (
                <p className="text-xs text-gray-500">
                  Ultimo aggiornamento: {new Date(feed.lastFetched).toLocaleString('it-IT')}
                </p>
              )}
              {feed.error && (
                <p className="text-xs text-red-500">Errore: {feed.error}</p>
              )}
            </div>
            <button
              onClick={() => onRemoveFeed(feed.id)}
              className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Rimuovi feed"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};