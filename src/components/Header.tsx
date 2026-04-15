import { useState } from 'react';

interface HeaderProps {
  currentPage: 'home' | 'feeds';
  onNavigate: (page: 'home' | 'feeds') => void;
}

export const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (page: 'home' | 'feeds') => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const navItems: { page: 'home' | 'feeds'; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'feeds', label: 'Feeds' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Title */}
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={`${import.meta.env.BASE_URL}vite.svg`}
            alt="PN"
            className="w-9 h-9"
          />
          <span className="text-xl font-bold text-gray-800">PickUpNews</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => handleNavigate(page)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                currentPage === page
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
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

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-2">
          {navItems.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => handleNavigate(page)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                currentPage === page
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
