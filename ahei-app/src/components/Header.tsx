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
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [apiResults, setApiResults] = useState<any[]>([]);

  // Debounced API search when typing
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setApiResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/universities?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (json.institutions) {
            setApiResults(json.institutions.slice(0, 6));
          }
        }
      } catch (err) {
        // Fallback to local memory
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayResults = apiResults.length > 0
    ? apiResults.map((inst: any) => ({
        id: inst.id || inst.institution_id,
        name: inst.name || inst.institution_name,
        city: inst.city,
        country: inst.country,
        country_iso2: inst.country_iso2,
        rank: inst.rank || 0,
        score: inst.composite_score || inst.data_completeness_score ? Math.round(Number(inst.data_completeness_score || 0.8) * 100) : 80
      }))
    : searchQuery.trim()
    ? allUniversities.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.flagshipFaculties.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5).map(u => ({
        id: u.id,
        name: u.name,
        city: u.city,
        country: u.country,
        country_iso2: u.countryCode,
        rank: u.rank,
        score: u.aheiScore
      }))
    : [];

  const handleSelectSearchResult = (uniId: string) => {
    onSelectUniversity(uniId);
    onNavigate('universities', uniId);
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedResultIndex(-1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f2f2f2] shadow-2xs border-b border-[#d5d5d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Masthead Brand */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xs bg-[#09090B] flex items-center justify-center p-1 shrink-0 text-white font-serif font-bold text-xs">
              <span className="material-symbols-outlined text-[20px] text-[#D9D7D0]">school</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-headline-sm text-[16px] xl:text-[18px] text-[#09090B] tracking-tight font-serif font-bold whitespace-nowrap">
                African Higher Education Index
              </span>
              <span className="font-code-badge text-[9px] tracking-widest uppercase text-[#838383] whitespace-nowrap hidden sm:inline">
                The Authority on Continental Academics
              </span>
            </div>
          </button>

          {/* Core Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-title-md text-[14px] shrink-0">
            <button
              onClick={() => onNavigate('rankings')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                currentScreen === 'rankings'
                  ? 'text-[#09090B] font-bold border-b-2 border-[#09090B]'
                  : 'text-[#838383] hover:text-[#232323]'
              }`}
            >
              Rankings
            </button>
            <button
              onClick={() => onNavigate('universities')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                currentScreen === 'universities'
                  ? 'text-[#09090B] font-bold border-b-2 border-[#09090B]'
                  : 'text-[#838383] hover:text-[#232323]'
              }`}
            >
              Universities
            </button>
            <button
              onClick={() => onNavigate('compare')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                currentScreen === 'compare'
                  ? 'text-[#09090B] font-bold border-b-2 border-[#09090B]'
                  : 'text-[#838383] hover:text-[#232323]'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => onNavigate('insights')}
              className={`py-1 transition-colors cursor-pointer whitespace-nowrap ${
                currentScreen === 'insights'
                  ? 'text-[#09090B] font-bold border-b-2 border-[#09090B]'
                  : 'text-[#838383] hover:text-[#232323]'
              }`}
            >
              Insights
            </button>
          </nav>
        </div>

        {/* Right Utility: Intelligent Search, Saved Count, Unified Sign In */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          <div className="relative hidden md:block">
            <div className="flex items-center bg-[#f9f9f9] border border-[#d5d5d5] px-2.5 py-1.5 w-48 xl:w-60 focus-within:border-[#09090B] transition-colors rounded-xs">
              <span className="material-symbols-outlined text-[17px] text-[#838383] mr-1.5" aria-hidden="true">search</span>
              <input
                type="text"
                value={searchQuery}
                aria-label="Search African universities or countries"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSearchResults(false);
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedResultIndex(prev => (prev < displayResults.length - 1 ? prev + 1 : 0));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedResultIndex(prev => (prev > 0 ? prev - 1 : displayResults.length - 1));
                  } else if (e.key === 'Enter' && selectedResultIndex >= 0 && displayResults[selectedResultIndex]) {
                    e.preventDefault();
                    handleSelectSearchResult(displayResults[selectedResultIndex].id);
                  }
                }}
                placeholder="Search universities, countries..."
                className="bg-transparent text-body-sm font-body-sm w-full outline-none placeholder:text-[#8c8e87] text-[#232323]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="text-[#8c8e87] hover:text-[#232323] text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchResults && displayResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#d5d5d5] shadow-none z-50 py-1">
                <div className="px-3 py-1 text-[10px] font-code-badge uppercase text-[#838383] bg-[#f9f9f9] border-b border-[#d5d5d5] flex items-center justify-between">
                  <span>Academic Registry Matches</span>
                  <span className="text-[#164A3A]">↑↓ to navigate</span>
                </div>
                {displayResults.map((uni, idx) => (
                  <button
                    key={uni.id}
                    onClick={() => handleSelectSearchResult(uni.id)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 border-b border-[#E6E3DC] last:border-0 cursor-pointer transition-colors ${
                      selectedResultIndex === idx ? 'bg-[#09090B]/10 border-l-2 border-l-[#09090B]' : 'hover:bg-[#f9f9f9]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-title-md text-xs text-[#09090B] font-bold truncate">
                        {uni.name}
                      </div>
                      <div className="text-[11px] text-[#838383]">
                        {uni.city ? `${uni.city}, ` : ''}{uni.country} {uni.rank > 0 ? `• #${uni.rank}` : ''}
                      </div>
                    </div>
                    <span className="font-code-badge text-xs font-bold text-[#164A3A]">
                      {uni.score}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved Universities Action */}
          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-1 font-body-sm text-[13px] text-[#838383] hover:text-[#232323] px-2 py-1 transition-colors cursor-pointer"
            title="View Saved Bookmarks"
          >
            <span className={`material-symbols-outlined text-[19px] ${savedUniversities.length > 0 ? 'text-[#164A3A]' : ''}`}>
              {savedUniversities.length > 0 ? 'bookmark' : 'bookmark_border'}
            </span>
            <span className="hidden sm:inline">Saved</span>
            <span className="font-semibold text-xs">({savedUniversities.length})</span>
          </button>

          {/* Single Unified Primary CTA: Sign In */}
          <button
            onClick={onOpenAuth}
            className="bg-[#09090B] text-white font-title-md text-[13px] px-3.5 py-1.5 hover:bg-[#2A6B55] transition-colors tracking-tight whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Sign In</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-[#09090B] cursor-pointer flex items-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-haspopup="true"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f2f2f2] border-b border-[#d5d5d5] px-6 py-4 space-y-3">
          {/* Mobile search bar if screen < xl */}
          <div className="xl:hidden">
            <div className="flex items-center bg-[#f9f9f9] border border-[#d5d5d5] px-2.5 py-1.5 focus-within:border-[#09090B] transition-colors">
              <span className="material-symbols-outlined text-[17px] text-[#838383] mr-1.5">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search universities, programmes..."
                className="bg-transparent text-body-sm font-body-sm w-full outline-none placeholder:text-[#8c8e87] text-[#232323]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#8c8e87] hover:text-[#232323] text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            {showSearchResults && displayResults.length > 0 && (
              <div className="mt-1 bg-white border border-[#d5d5d5] shadow-none py-1">
                {displayResults.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      handleSelectSearchResult(uni.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#f9f9f9] flex items-center justify-between gap-2 border-b border-[#E6E3DC] last:border-0 cursor-pointer"
                  >
                    <div className="truncate">
                      <div className="font-title-md text-xs text-[#09090B] font-bold truncate">
                        {uni.name}
                      </div>
                      <div className="text-[11px] text-[#838383]">
                        {uni.city ? `${uni.city}, ` : ''}{uni.country} {uni.rank > 0 ? `• #${uni.rank}` : ''}
                      </div>
                    </div>
                    <span className="font-code-badge text-xs font-bold text-[#164A3A]">
                      {uni.score}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 font-title-md text-sm">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-1 font-semibold ${currentScreen === 'home' ? 'text-[#164A3A]' : 'text-[#09090B]'}`}
            >
              Home (Continental Intelligence)
            </button>
            <button
              onClick={() => {
                onNavigate('rankings');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-1 font-semibold ${currentScreen === 'rankings' ? 'text-[#164A3A]' : 'text-[#09090B]'}`}
            >
              Rankings (League Table)
            </button>
            <button
              onClick={() => {
                onNavigate('universities');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-1 font-semibold ${currentScreen === 'universities' ? 'text-[#164A3A]' : 'text-[#09090B]'}`}
            >
              Universities Dossiers
            </button>
            <button
              onClick={() => {
                onNavigate('rankings');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#838383] hover:text-[#09090B]"
            >
              Subjects
            </button>
            <button
              onClick={() => {
                onNavigate('rankings');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#838383] hover:text-[#09090B]"
            >
              Countries
            </button>
            <button
              onClick={() => {
                onNavigate('rankings');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#838383] hover:text-[#09090B]"
            >
              Regions
            </button>
            <button
              onClick={() => {
                onNavigate('compare');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-1 font-semibold ${currentScreen === 'compare' ? 'text-[#164A3A]' : 'text-[#09090B]'}`}
            >
              Compare Universities
            </button>
            <button
              onClick={() => {
                onNavigate('insights');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-1 font-semibold ${currentScreen === 'insights' ? 'text-[#164A3A]' : 'text-[#09090B]'}`}
            >
              Insights &amp; Working Papers
            </button>
          </div>
          <div className="pt-2 border-t border-[#d5d5d5] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#09090B] text-white py-2 text-center text-sm font-semibold"
            >
              Sign In / Institutional Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
