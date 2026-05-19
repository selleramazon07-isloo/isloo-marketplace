import { useState, useEffect } from 'react';
import { Search, Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../lib/supabase';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange, onUploadClick, selectedCategory, onCategoryChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-surface-100' : 'bg-white border-b border-surface-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
              <span className="text-white font-black text-lg leading-none">i</span>
            </div>
            <span className="text-2xl font-black tracking-tight hidden sm:block">
              <span className="text-brand-500">isloo</span><span className="text-brand-300">.com</span>
            </span>
          </a>

          {/* Location */}
          <button className="hidden md:flex items-center gap-1.5 text-sm bg-surface-50 rounded-full px-3.5 py-1.5 border border-surface-200 flex-shrink-0 hover:bg-brand-50 hover:border-brand-200 transition-all duration-200 group">
            <MapPin size={13} className="text-brand-500" />
            <span className="text-surface-700 font-medium">Islamabad</span>
            <ChevronDown size={12} className="text-surface-400 group-hover:text-brand-500 transition-colors" />
          </button>

          {/* Search */}
          <div className="flex-1 hidden sm:block max-w-xl">
            <div className="relative group">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Search cars, property, mobiles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all duration-200 placeholder-surface-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden btn-ghost p-2"
            >
              <Search size={20} />
            </button>

            <button
              onClick={onUploadClick}
              className="btn-primary"
            >
              <span className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">Post Ad</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-ghost p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 animate-fade-in-down">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="input-field pl-10"
              />
            </div>
          </div>
        )}

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-1 pb-2.5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onCategoryChange('All')}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'text-brand-500 bg-brand-50'
                : 'text-surface-500 hover:text-brand-500 hover:bg-brand-50'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.name
                  ? 'text-brand-500 bg-brand-50'
                  : 'text-surface-500 hover:text-brand-500 hover:bg-brand-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-100 bg-white px-4 py-4 animate-fade-in-down">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { onCategoryChange('All'); setMobileMenuOpen(false); }}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-600 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { onCategoryChange(cat.name); setMobileMenuOpen(false); }}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedCategory === cat.name
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface-100 text-surface-600 hover:bg-brand-50 hover:text-brand-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
