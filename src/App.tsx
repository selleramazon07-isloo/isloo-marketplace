import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { supabase, Listing, CATEGORIES } from './lib/supabase';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ListingCard from './components/ListingCard';
import ListingModal from './components/ListingModal';
import UploadModal from './components/UploadModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/EditProfilePage';
import { SlidersHorizontal, ChevronDown, Loader, SearchX } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const activeSubcategories = CATEGORIES.find(c => c.name === selectedCategory)?.subcategories ?? [];

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('listings').select('*');

    if (selectedCategory !== 'All') {
      query = query.eq('category', selectedCategory);
    }

    if (selectedSubcategory !== 'All') {
      query = query.eq('subcategory', selectedSubcategory);
    }

    if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
    else if (sortBy === 'oldest') query = query.order('created_at', { ascending: true });
    else if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });

    const { data, error } = await query;
    if (!error && data) {
      setListings(data as Listing[]);
    }
    setLoading(false);
  }, [selectedCategory, selectedSubcategory, sortBy]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('All');
  };

  const filteredListings = listings.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.subcategory.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  });

  const featuredListings = filteredListings.filter((l) => l.is_featured);
  const regularListings = filteredListings.filter((l) => !l.is_featured);

  const sectionTitle = selectedCategory === 'All'
    ? 'All Listings'
    : selectedSubcategory === 'All'
      ? selectedCategory
      : selectedSubcategory;

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={() => setShowUploadModal(true)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <HeroBanner />

      <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${
                selectedCategory === cat.name
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategory pills */}
        {selectedCategory !== 'All' && activeSubcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide animate-fade-in">
            <button
              onClick={() => setSelectedSubcategory('All')}
              className={`flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 ${
                selectedSubcategory === 'All'
                  ? 'bg-brand-50 text-brand-600 border-brand-200'
                  : 'bg-white text-surface-500 border-surface-200 hover:border-brand-200 hover:text-brand-600'
              }`}
            >
              All {selectedCategory}
            </button>
            {activeSubcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 ${
                  selectedSubcategory === sub
                    ? 'bg-brand-50 text-brand-600 border-brand-200'
                    : 'bg-white text-surface-500 border-surface-200 hover:border-brand-200 hover:text-brand-600'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3">
          <p className="text-sm text-surface-400 font-medium">
            {loading ? '...' : (
              <>
                <span className="text-surface-700 font-semibold">{filteredListings.length}</span>
                {' '}listing{filteredListings.length !== 1 ? 's' : ''}
              </>
            )}
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-surface-200 text-sm text-surface-600 font-medium rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-secondary text-xs py-2 px-3"
            >
              <SlidersHorizontal size={14} />
              Sort
            </button>
          </div>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="sm:hidden bg-white border border-surface-100 rounded-2xl p-4 mb-4 animate-fade-in-down">
            <label className="label mb-2">Sort By</label>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setSortBy(o.value); setShowFilters(false); }}
                  className={`text-sm py-2.5 px-3 rounded-xl border transition-all duration-200 ${
                    sortBy === o.value ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-surface-600 border-surface-200 hover:border-brand-300'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader size={32} className="animate-spin text-brand-500" />
            <p className="text-surface-400 text-sm">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <div className="w-20 h-20 bg-surface-100 rounded-2xl flex items-center justify-center">
              <SearchX size={36} className="text-surface-300" />
            </div>
            <div className="text-center">
              <p className="text-surface-700 font-bold text-lg">No listings found</p>
              <p className="text-surface-400 text-sm mt-1">
                {searchQuery ? `No results for "${searchQuery}"` : 'No listings in this category yet'}
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedSubcategory('All'); }}
              className="text-brand-500 text-sm font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {featuredListings.length > 0 && (
              <section className="mb-8 animate-fade-in-up">
                <div className="flex items-center gap-2.5 mb-4">
                  <h2 className="section-title">Featured Listings</h2>
                  <span className="badge bg-warning-50 text-warning-600 border border-warning-100">
                    {featuredListings.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {featuredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />
                  ))}
                </div>
              </section>
            )}

            {regularListings.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <h2 className="section-title">{sectionTitle}</h2>
                  <span className="badge bg-brand-50 text-brand-600 border border-brand-100">
                    {regularListings.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {regularListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} onClick={setSelectedListing} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-black text-sm">i</span>
                </div>
                <span className="text-xl font-black tracking-tight">
                  <span className="text-brand-500">isloo</span><span className="text-brand-300">.com</span>
                </span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Islamabad's trusted online marketplace. Buy and sell locally with confidence.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-surface-800 mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {['About Us', 'Safety Tips', 'Contact', 'FAQs'].map((link) => (
                  <a key={link} href="#" className="text-sm text-surface-400 hover:text-brand-500 transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-surface-800 mb-3">Categories</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-sm text-surface-400 hover:text-brand-500 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-surface-400">&copy; 2026 Isloo.com &mdash; All rights reserved</p>
            <div className="flex gap-4 text-xs text-surface-400">
              <a href="#" className="hover:text-brand-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-500 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {selectedListing && (
        <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => { setShowUploadModal(false); fetchListings(); }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
