import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HeaderProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';

export const Header = ({ currentPage, themeMode, onToggleTheme, onNavigate }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { messages } = useI18n();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavigate = (page: 'home' | 'settings') => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const navItems: { page: 'home' | 'settings'; label: string }[] = [
    { page: 'home', label: messages.common.home },
    { page: 'settings', label: messages.common.settings },
  ];

  const mobileDrawer = menuOpen ? createPortal(
    <div className="sm:hidden fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label={messages.common.closeMenu}
        className="absolute inset-0 bg-slate-950/45"
        onClick={() => setMenuOpen(false)}
      />
      <aside className="mobile-drawer surface-strong fixed inset-y-0 right-0 z-10 h-dvh w-[min(82vw,22rem)] overflow-y-auto border-l border-[color:var(--border)] px-5 py-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{messages.common.navigation}</p>
            <p className="mt-1 text-lg font-bold text-primary">PickUpNews</p>
          </div>
          <button
            className="rounded-lg p-2 text-secondary hover:bg-[color:var(--surface-muted)] transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label={messages.common.closeMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-5 space-y-2">
          {navItems.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => handleNavigate(page)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors border ${
                currentPage === page
                  ? 'badge-brand'
                  : 'text-secondary border-transparent hover:border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onToggleTheme}
            className="nav-theme-action-mobile w-full"
            aria-label={messages.common.changeTheme}
          >
            <span aria-hidden="true">{themeMode === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </nav>

      </aside>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b backdrop-blur border-[color:var(--border)] bg-[color:var(--surface)]/95">
        <div className="app-container h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-3 hover:opacity-85 transition-opacity"
        >
          <img
            src={`${import.meta.env.BASE_URL}pickupnews-mark.svg`}
            alt="PN"
            className="w-9 h-9 rounded-xl"
          />
          <span className="text-xl font-bold text-primary">PickUpNews</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-2">
          {navItems.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => handleNavigate(page)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${
                currentPage === page
                  ? 'badge-brand'
                  : 'text-secondary border-transparent hover:border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onToggleTheme}
            className="nav-theme-action"
            aria-label={messages.common.changeTheme}
          >
            <span aria-hidden="true">{themeMode === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-secondary hover:bg-[color:var(--surface-muted)] transition-colors"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? messages.common.closeMenu : messages.common.toggleMenu}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        </div>
      </header>
      {mobileDrawer}
    </>
  );
};
