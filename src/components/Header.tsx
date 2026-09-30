import React, { useState } from 'react';
import { University } from '../data/universities';

interface HeaderProps {
  currentScreen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights';
  onNavigate: (screen: 'home' | 'rankings' | 'universities' | 'compare' | 'insights', universityId?: string) => void;
  savedUniversities: string[];
  onOpenBookmarks: () => void;
  onOpenAuth: () => void;
  onOpenMethodology: () => void;
  allUniversities: University[];
  onSelectUniversity: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  savedUniversities,
  onOpenBookmarks,
  onOpenAuth,
  onOpenMethodology,
  allUniversities,
  onSelectUniversity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredUnis = searchQuery.trim()
    ? allUniversities.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.flagshipFaculties.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSelectSearchResult = (uniId: string) => {
    onSelectUniversity(uniId);
    onNavigate('universities', uniId);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9fd] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#c0c8c3]">
      <div className="h-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between">
        {/* Tier 1: Eyebrow metadata & international links */}
        <div className="h-7 border-b border-[#c0c8c3] flex items-center justify-between font-code-badge text-[#414845] text-[11px]">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 bg-[#a14013]"></span>
            <span className="tracking-wider uppercase font-semibold text-[#00241a]">AHEI 2027 Edition</span>
            <span className="text-[#c0c8c3]">•</span>
            <span className="hidden sm:inline">54 African Countries</span>
            <span className="text-[#c0c8c3] hidden sm:inline">•</span>
            <span className="hidden md:inline">Independent Academic Intelligence</span>
            <span className="text-[#c0c8c3] hidden md:inline">•</span>
            <span>Published October 2026</span>
          </div>
          <div className="flex items-center gap-3 font-body-sm text-[12px] font-medium shrink-0">
            <button
              onClick={onOpenMethodology}
              className="hover:text-[#00241a] transition-colors cursor-pointer"
            >
              Methodology &amp; Ethics
            </button>
            <span className="text-[#c0c8c3]">•</span>
            <button
              onClick={() => onOpenAuth()}
              className="hover:text-[#00241a] transition-colors cursor-pointer hidden sm:inline"
            >
              Data Submissions
            </button>
            <span className="text-[#c0c8c3] hidden sm:inline">•</span>
            <button
              onClick={() => onNavigate('insights')}
              className="hover:text-[#00241a] transition-colors cursor-pointer hidden md:inline"
            >
              Research Council
            </button>
            <span className="text-[#c0c8c3] hidden md:inline">•</span>
            <button className="hover:text-[#00241a] transition-colors font-semibold text-[#a14013] cursor-pointer">
              Français
            </button>
          </div>
        </div>

        {/* Tier 2: Primary Masthead & Navigation */}
        <div className="h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-sm bg-[#00241a] flex items-center justify-center p-1 shrink-0 text-white font-serif font-bold text-xs">
                <span className="material-symbols-outlined text-[20px] text-[#bfecd9]">school</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-headline-sm text-[17px] text-[#00241a] tracking-tight font-serif font-bold">
                  African Higher Education Index
                </span>
                <span className="font-code-badge text-[9px] tracking-widest uppercase text-[#414845]">
                  The Authority on Continental Academics
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5 font-title-md text-[14px]">
              <button
                onClick={() => onNavigate('rankings')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentScreen === 'rankings'
                    ? 'text-[#00241a] font-bold border-b-2 border-[#00241a]'
                    : 'text-[#414845] hover:text-[#1b1b1f]'
                }`}
              >
                Rankings
              </button>
              <button
                onClick={() => onNavigate('universities')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentScreen === 'universities'
                    ? 'text-[#00241a] font-bold border-b-2 border-[#00241a]'
                    : 'text-[#414845] hover:text-[#1b1b1f]'
                }`}
              >
                Universities
              </button>
              <button
                onClick={() => onNavigate('rankings')}
                className="text-[#414845] hover:text-[#1b1b1f] py-1 transition-colors cursor-pointer"
              >
                Subjects
              </button>
              <button
                onClick={() => onNavigate('rankings')}
                className="text-[#414845] hover:text-[#1b1b1f] py-1 transition-colors cursor-pointer hidden 2xl:inline"
              >
                Countries
              </button>
              <button
                onClick={() => onNavigate('rankings')}
                className="text-[#414845] hover:text-[#1b1b1f] py-1 transition-colors cursor-pointer"
              >
                Regions
              </button>
              <button
                onClick={() => onNavigate('compare')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentScreen === 'compare'
                    ? 'text-[#00241a] font-bold border-b-2 border-[#00241a]'
                    : 'text-[#414845] hover:text-[#1b1b1f]'
                }`}
              >
                Compare
              </button>
              <button
                onClick={() => onNavigate('insights')}
                className={`py-1 transition-colors cursor-pointer ${
                  currentScreen === 'insights'
                    ? 'text-[#00241a] font-bold border-b-2 border-[#00241a]'
                    : 'text-[#414845] hover:text-[#1b1b1f]'
                }`}
              >
                Insights
              </button>
            </nav>
          </div>

          {/* Quick Search, Saved Count, Auth Button */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <div className="flex items-center bg-[#f5f3f7] border border-[#c0c8c3] px-2.5 py-1.5 w-60 lg:w-72 focus-within:border-[#00241a] transition-colors">
                <span className="material-symbols-outlined text-[18px] text-[#414845] mr-1.5">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search 1,000+ universities, programmes..."
                  className="bg-transparent text-body-sm font-body-sm w-full outline-none placeholder:text-[#717974] text-[#1b1b1f]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#717974] hover:text-[#1b1b1f] text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchResults && filteredUnis.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c0c8c3] shadow-lg z-50 py-1">
                  <div className="px-3 py-1 text-[10px] font-code-badge uppercase text-[#414845] bg-[#f5f3f7] border-b border-[#c0c8c3]">
                    Academic Registry Matches
                  </div>
                  {filteredUnis.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => handleSelectSearchResult(uni.id)}
                      className="w-full px-3 py-2 text-left hover:bg-[#f5f3f7] flex items-center justify-between gap-2 border-b border-[#efedf1] last:border-0 cursor-pointer"
                    >
                      <div className="truncate">
                        <div className="font-title-md text-xs text-[#00241a] font-bold truncate">
                          {uni.name}
                        </div>
                        <div className="text-[11px] text-[#414845]">
                          {uni.city}, {uni.country} • Rank #{uni.rank}
                        </div>
                      </div>
                      <span className="font-code-badge text-xs font-bold text-[#a14013]">
                        {uni.aheiScore}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Universities Badge */}
            <button
              onClick={onOpenBookmarks}
              className="flex items-center gap-1 font-body-sm text-body-sm text-[#414845] hover:text-[#1b1b1f] px-2 py-1 transition-colors cursor-pointer"
              title="View Bookmarked Dossiers"
            >
              <span className={`material-symbols-outlined text-[18px] ${savedUniversities.length > 0 ? 'text-[#a14013]' : ''}`}>
                {savedUniversities.length > 0 ? 'bookmark' : 'bookmark_border'}
              </span>
              <span className="hidden sm:inline">Saved</span>
              <span className="font-semibold text-xs">({savedUniversities.length})</span>
            </button>

            {/* Sign In CTA */}
            <button
              onClick={onOpenAuth}
              className="bg-[#00241a] text-white font-title-md text-[13px] px-3.5 py-1.5 hover:bg-[#0e3b2e] transition-colors tracking-tight whitespace-nowrap hidden sm:inline-block cursor-pointer"
            >
              Sign In / Institutional Access
            </button>

            <button
              onClick={onOpenAuth}
              className="w-8 h-8 rounded-full bg-[#00241a] flex items-center justify-center shrink-0 text-white cursor-pointer hover:bg-[#0e3b2e]"
              title="Account"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1 text-[#00241a] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Tier 3: Trending Directives Bar */}
        <div className="h-7 border-t border-[#c0c8c3] flex items-center justify-between font-body-sm text-[12px]">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            <span className="font-code-badge text-[10px] uppercase tracking-wider text-[#a14013] font-semibold">
              Trending Directives:
            </span>
            <button
              onClick={() => onNavigate('rankings')}
              className="text-[#414845] hover:text-[#a14013] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
            >
              Top 100 Africa
            </button>
            <span className="text-[#c0c8c3]">•</span>
            <button
              onClick={() => onNavigate('rankings')}
              className="text-[#414845] hover:text-[#a14013] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
            >
              East Africa Leaderboard
            </button>
            <span className="text-[#c0c8c3]">•</span>
            <button
              onClick={() => onNavigate('rankings')}
              className="text-[#414845] hover:text-[#a14013] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
            >
              STEM &amp; AI Index
            </button>
            <span className="text-[#c0c8c3]">•</span>
            <button
              onClick={() => onNavigate('compare')}
              className="text-[#414845] hover:text-[#a14013] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
            >
              Tuition &amp; Affordability
            </button>
            <span className="text-[#c0c8c3]">•</span>
            <button
              onClick={onOpenMethodology}
              className="text-[#414845] hover:text-[#a14013] transition-colors underline decoration-[#c0c8c3] underline-offset-4 cursor-pointer"
            >
              Methodology 2027
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-1 font-code-badge text-[11px] text-[#414845] shrink-0">
            <span className="material-symbols-outlined text-[14px] text-[#a14013]">verified_user</span>
            <span>ISO/AHEI Academic Data Standard</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#faf9fd] border-b border-[#c0c8c3] px-6 py-4 space-y-3">
          <div className="flex flex-col gap-2 font-title-md text-sm">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#00241a] font-semibold"
            >
              Home (Continental Intelligence)
            </button>
            <button
              onClick={() => {
                onNavigate('rankings');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#00241a] font-semibold"
            >
              Rankings (League Table)
            </button>
            <button
              onClick={() => {
                onNavigate('universities');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#00241a] font-semibold"
            >
              Universities Dossiers
            </button>
            <button
              onClick={() => {
                onNavigate('compare');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#00241a] font-semibold"
            >
              Compare Universities
            </button>
            <button
              onClick={() => {
                onNavigate('insights');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#00241a] font-semibold"
            >
              Insights &amp; Working Papers
            </button>
          </div>
          <div className="pt-2 border-t border-[#c0c8c3] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#00241a] text-white py-2 text-center text-sm font-semibold"
            >
              Sign In / Institutional Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
