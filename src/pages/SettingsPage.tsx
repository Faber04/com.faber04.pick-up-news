interface SettingsPageProps {
  version: string;
}

const currentYear = new Date().getFullYear();

export const SettingsPage = ({ version }: SettingsPageProps) => {
  return (
    <div className="app-container py-8 stagger-in">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface rounded-2xl p-6 md:p-8">
          <span className="badge-brand inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Settings
          </span>
          <h2 className="mt-4 text-3xl font-bold text-primary">Informazioni app e crediti</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
            PickUpNews raccoglie i tuoi feed in un&apos;interfaccia unica, leggera e leggibile su desktop e mobile.
            Questa sezione riunisce i riferimenti del progetto e lo stato della release corrente.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="surface-muted rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Versione</p>
              <p className="mt-2 text-2xl font-bold text-primary">v{version}</p>
              <p className="mt-1 text-sm text-secondary">Milestone UI con Settings, drawer mobile e modal articolo ottimizzato.</p>
            </div>

            <div className="surface-muted rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Autore</p>
              <p className="mt-2 text-2xl font-bold text-primary">Faber04</p>
              <a
                href="https://github.com/Faber04"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-sm font-medium text-[var(--brand-strong)] hover:opacity-80"
              >
                github.com/Faber04
              </a>
            </div>
          </div>
        </section>

        <aside className="surface-strong rounded-2xl border border-[color:var(--border)] p-6 md:p-8">
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
              <dt className="text-muted">Release</dt>
              <dd className="font-medium text-primary">v{version}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-4">
              <dt className="text-muted">Creato da</dt>
              <dd className="font-medium text-primary">Faber04</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-4">
              <dt className="text-muted">Copyright</dt>
              <dd className="font-medium text-primary">© {currentYear}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted">Tema</dt>
              <dd className="font-medium text-primary">Light / Dark</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
};