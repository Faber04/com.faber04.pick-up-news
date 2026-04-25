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
      <section className="surface rounded-2xl p-6 md:p-8">
        <span className="badge-brand inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Settings
        </span>
        <h2 className="mt-4 text-3xl font-bold text-primary">Informazioni app e crediti</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
          PickUpNews raccoglie i tuoi feed in un&apos;interfaccia unica, leggera e leggibile su desktop e mobile.
          Da qui puoi gestire il tema e aprire la sezione Feed.
        </p>

        <div className="mt-6 surface-strong rounded-2xl border border-[color:var(--border)] p-6 md:p-8">
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}pickupnews-mark.svg`}
              alt="PickUpNews"
              className="h-14 w-14 rounded-2xl"
            />
            <div>
              <p className="text-lg font-bold text-primary">PickUpNews</p>
              <p className="text-sm text-secondary">RSS reader essenziale, ordinato e locale-first.</p>
            </div>
          </div>

          <dl className="mt-6 space-y-4 text-sm text-secondary">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-4">
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
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
              📡 Apri Gestione Feed
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">Release corrente v{version}</p>
        </div>
      </section>
    </div>
  );
};