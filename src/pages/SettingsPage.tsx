import type { SettingsPageProps } from '../types/page-props';
import { useI18n } from '../i18n/useI18n';

const currentYear = new Date().getFullYear();

export const SettingsPage = ({ version, onOpenFeeds, onOpenLanguage }: SettingsPageProps) => {
  const { messages } = useI18n();

  return (
    <div className="app-container py-8 stagger-in">
      {/* Menu top - full-width buttons */}
      <div className="space-y-3 mb-8">
        <button
          className="btn-brand w-full rounded-lg px-4 py-3 text-sm font-medium transition"
          onClick={onOpenLanguage}
        >
          {messages.settings.languageAction}
        </button>
        <button
          className="btn-brand w-full rounded-lg px-4 py-3 text-sm font-medium transition"
          onClick={onOpenFeeds}
        >
          {messages.settings.manageFeedsAction}
        </button>
      </div>

      {/* Info section - esploso, senza box */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-2">{messages.settings.appInfo}</p>
          <dl className="space-y-3 text-sm text-secondary">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-3">
              <dt className="text-muted">{messages.settings.copyright}</dt>
              <dd className="font-medium text-primary">© {currentYear}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-3">
              <dt className="text-muted">{messages.settings.currentLanguage}</dt>
              <dd className="font-medium text-primary">
                {messages.language.flag} {messages.language.label}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted">{messages.settings.repository}</dt>
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
              <dt className="text-muted">{messages.settings.version}</dt>
              <dd className="font-medium text-primary">v{version}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};
