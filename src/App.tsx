import { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import {
  AddFeedForm,
  FeedList,
  NewsList,
  ViewControls,
  NewsDetailModal
} from './components';
import { NewsItem } from './types';

function App() {
  const {
    state,
    viewMode,
    setViewMode,
    addFeed,
    removeFeed,
    refreshNews,
    getFilteredNews,
    clearError
  } = useAppState();

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-refresh news when feeds change
  useEffect(() => {
    if (state.feeds.length > 0) {
      refreshNews();
    }
  }, [state.feeds.length]); // Only trigger when feeds length changes

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const filteredNews = getFilteredNews();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <img src={`${import.meta.env.BASE_URL}vite.svg`} alt="PN" className="w-10 h-10" />
            PickUpNews
          </h1>
          <p className="text-gray-600">
            Leggi i tuoi feed RSS preferiti in un'unica interfaccia
          </p>
        </header>

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{state.error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Add Feed Form */}
        <AddFeedForm onAddFeed={addFeed} loading={state.loading} />

        {/* Feed Management */}
        <FeedList
          feeds={state.feeds}
          onRemoveFeed={removeFeed}
          onRefresh={refreshNews}
          loading={state.loading}
        />

        {/* News Section */}
        <ViewControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          newsCount={filteredNews.length}
        />

        <NewsList
          news={filteredNews}
          viewMode={viewMode}
          loading={state.loading}
          onNewsClick={handleNewsClick}
        />

        {/* News Detail Modal */}
        <NewsDetailModal
          newsItem={selectedNews}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default App;
