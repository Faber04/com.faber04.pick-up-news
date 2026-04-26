import { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { getNavigationLabel } from './i18n';
import { useI18n } from './i18n/useI18n';
import {
  Header,
  NewsList,
  ViewControls,
  NewsDetailModal,
  Breadcrumb,
  SubpageContainer,
  FeedsContent,
} from './components';
import { SettingsPage } from './pages/SettingsPage';
import { NewsItem } from './types';
import type { NavigationState, BreadcrumbNode, NavigationActions } from './types/navigation';

const APP_VERSION = '1.4.8';

function App() {
  const { messages, supportedLanguages, language, setLanguage } = useI18n();
  const {
    state,
    viewMode,
    setViewMode,
    themeMode,
    toggleTheme,
    addFeed,
    removeFeed,
    moveFeed,
    moveFeedToIndex,
    updateFeed,
    refreshNews,
    getFilteredNews,
    clearError,
  } = useAppState(messages.errors);

  const createNode = (id: string, params?: Record<string, unknown>): BreadcrumbNode => ({
    id,
    label: getNavigationLabel(id, messages),
    params,
  });

  const [navigation, setNavigation] = useState<NavigationState>({
    trail: [createNode('home')],
  });

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPageNode = navigation.trail[navigation.trail.length - 1];
  const headerPage: 'home' | 'settings' = currentPageNode.id === 'home' ? 'home' : 'settings';

  const navigationActions: NavigationActions = {
    push: (node: BreadcrumbNode) => {
      setNavigation((prev) => ({
        trail: [...prev.trail, node],
      }));
    },
    pop: () => {
      setNavigation((prev) => ({
        trail: prev.trail.length > 1 ? prev.trail.slice(0, -1) : prev.trail,
      }));
    },
    goToIndex: (index: number) => {
      setNavigation((prev) => ({
        trail: prev.trail.slice(0, index + 1),
      }));
    },
    reset: () => {
      setNavigation({
        trail: [createNode('home')],
      });
    },
  };

  useEffect(() => {
    setNavigation((prev) => ({
      trail: prev.trail.map((node) => ({
        ...node,
        label: getNavigationLabel(node.id, messages),
      })),
    }));
  }, [messages]);

  // Auto-refresh news when feeds change
  useEffect(() => {
    if (state.feeds.length > 0) {
      refreshNews();
    }
  }, [state.feeds.length, refreshNews]);

  // Clear feed-related errors when leaving the Feeds page
  useEffect(() => {
    if (currentPageNode.id !== 'feeds' && state.error) {
      clearError();
    }
  }, [currentPageNode.id, state.error, clearError]);

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
    <div className="app-shell">
      <Header
        currentPage={headerPage}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onNavigate={(page) => {
          if (page === 'home') {
            navigationActions.reset();
          } else if (page === 'settings') {
            navigationActions.reset();
            navigationActions.push(createNode('settings'));
          }
        }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb trail={navigation.trail} onNavigate={navigationActions} />

      {/* Error Message */}
      {state.error && currentPageNode.id !== 'feeds' && (
        <div className="app-container pt-4">
          <div className="surface rounded-lg px-4 py-3 flex justify-between items-center text-secondary">
            <span className="text-[var(--danger)]">{state.error}</span>
            <button
              onClick={clearError}
              className="text-[var(--danger)] hover:opacity-80 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page Routing */}
      {currentPageNode.id === 'home' ? (
        <div className="app-container py-8 stagger-in">
          {state.feeds.length === 0 ? (
            <div className="text-center py-16 text-muted surface rounded-2xl">
              <img
                src={`${import.meta.env.BASE_URL}pickupnews-mark.svg`}
                alt="PN"
                className="w-16 h-16 mx-auto mb-4 opacity-80"
              />
              <p className="text-lg font-semibold mb-2 text-primary">{messages.home.emptyTitle}</p>
              <p className="text-sm mb-4">{messages.home.emptyDescription}</p>
              <button
                onClick={() => {
                  navigationActions.reset();
                  navigationActions.push(createNode('settings'));
                  navigationActions.push(createNode('feeds'));
                }}
                className="btn-brand px-6 py-2 rounded-lg font-medium transition"
              >
                {messages.home.emptyAction}
              </button>
            </div>
          ) : (
            <>
              <ViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              <NewsList
                news={filteredNews}
                viewMode={viewMode}
                feedOrder={state.feeds.map((feed) => feed.id)}
                loading={state.loading}
                onNewsClick={handleNewsClick}
              />
            </>
          )}
        </div>
      ) : currentPageNode.id === 'settings' ? (
        <SettingsPage
          version={APP_VERSION}
          onOpenLanguage={() => {
            navigationActions.push(createNode('language'));
          }}
          onOpenFeeds={() => {
            navigationActions.push(createNode('feeds'));
          }}
        />
      ) : currentPageNode.id === 'language' ? (
        <SubpageContainer
          title={messages.common.language}
          onBack={() => navigationActions.pop()}
        >
          <div className="space-y-3">
            <p className="text-sm text-secondary">{messages.settings.languageDescription}</p>
            <p className="text-xs text-muted">{messages.settings.languageHelp}</p>
            <div className="space-y-3 pt-2">
              {supportedLanguages.map((option) => {
                const isActive = option.code === language;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setLanguage(option.code)}
                    className={`surface w-full rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-[color:var(--ring)] ring-2 ring-[color:var(--ring)]'
                        : 'border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-medium text-primary">
                        {option.flag} {option.label}
                      </span>
                      {isActive && <span className="text-xs badge-brand rounded-full px-2 py-1">{messages.settings.currentLanguage}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </SubpageContainer>
      ) : currentPageNode.id === 'feeds' ? (
        <SubpageContainer
          title={messages.common.manageFeeds}
          onBack={() => navigationActions.pop()}
        >
          <FeedsContent
            feeds={state.feeds}
            loading={state.loading}
            addFeedError={state.error}
            onAddFeed={addFeed}
            onClearError={clearError}
            onRemoveFeed={removeFeed}
            onMoveFeed={moveFeed}
            onMoveFeedToIndex={moveFeedToIndex}
            onEditFeed={updateFeed}
            onRefresh={refreshNews}
          />
        </SubpageContainer>
      ) : (
        <div className="app-container py-8 stagger-in">
          <p className="text-center text-muted">{messages.common.pageNotFound}</p>
        </div>
      )}

      {/* News Detail Modal */}
      <NewsDetailModal
        newsItem={selectedNews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
