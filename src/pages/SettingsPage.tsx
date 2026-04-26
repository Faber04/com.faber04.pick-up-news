import type { ThemeMode } from '../hooks/useAppState';

interface SettingsPageProps {
  version: string;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onOpenFeeds: () => void;
}

const currentYear = new Date().getFullYear();

export const SettingsPage = ({ version, themeMode, onToggleTheme, onOpenFeeds }: SettingsPageProps) => {
  return (
    <div className="app-container py-8 stagger-in">
      {/* Menu top - full-width buttons */}
      <div className="space-y-3 mb-8">
        <button
          className="btn-neutral w-full rounded-lg px-4 py-3 text-sm font-medium transition"
          onClick={onToggleTheme}
        >
          {themeMode === 'dark' ? '☀️ Passa a Light' : '🌙 Passa a Dark'}
        </button>
        <button
          className="btn-brand w-full rounded-lg px-4 py-3 text-sm font-medium transition"
          onClick={onOpenFeeds}
        >
          📡 Gestisci Feed
        </button>
      </div>

      {/* Info section - esploso, senza box */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-2">Informazioni app</p>
          <dl className="space-y-3 text-sm text-secondary">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-3">
              <dt className="text-muted">Copyright</dt>
              <dd className="font-medium text-primary">© {currentYear}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted">Repository</dt>
              <dd className="font-medium text-primary">
                <a
                  href="https://github.com/Faber04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-medium text-[var(--brand-strong)] hover:opacity-80"
                >
                  github.com/Faber04
                </a>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-[color:var(--border)] pt-3">
              <dt className="text-muted">Version</dt>
              <dd className="font-medium text-primary">v{version}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};
